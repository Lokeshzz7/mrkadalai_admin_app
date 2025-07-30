import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOADING':
            return { ...state, loading: true, error: null };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload,
                error: null
            };
        case 'SET_CURRENT_OUTLET':
            return {
                ...state,
                currentOutletId: action.payload
            };
        case 'LOGOUT':
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                currentOutletId: null,
                error: null
            };
        case 'ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
};

const initialState = {
    isAuthenticated: false,
    user: null,
    currentOutletId: null, // Track current outlet for admin
    loading: true,
    error: null,
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' });
    }, []);

    // Helper function to check admin permissions for specific outlet
    const hasAdminPermission = useCallback((permissionType, outletId = null) => {
        if (!state.user || !state.user.outlets) {
            return false;
        }

        // Use provided outletId or current outlet
        const targetOutletId = outletId || state.currentOutletId;

        if (!targetOutletId) {
            return false;
        }

        // Find the outlet in user's outlets array
        const outlet = state.user.outlets.find(outlet => outlet.outletId === targetOutletId);

        if (!outlet || !outlet.permissions) {
            return false;
        }

        // Check if permission exists and is granted
        return outlet.permissions.some(perm =>
            perm.type === permissionType && perm.isGranted === true
        );
    }, [state.user, state.currentOutletId]);

    // Helper function to get current outlet details
    const getCurrentOutlet = useCallback(() => {
        if (!state.user || !state.user.outlets || !state.currentOutletId) {
            return null;
        }

        return state.user.outlets.find(outlet => outlet.outletId === state.currentOutletId);
    }, [state.user, state.currentOutletId]);

    // Helper function to get all accessible outlets for admin
    const getAccessibleOutlets = useCallback(() => {
        if (!state.user || !state.user.outlets) {
            return [];
        }

        return state.user.outlets.map(outlet => ({
            id: outlet.outletId,
            name: outlet.outlet.name,
            address: outlet.outlet.address,
            email: outlet.outlet.email,
            phone: outlet.outlet.phone,
            isActive: outlet.outlet.isActive
        }));
    }, [state.user]);

    // NEW: Helper function to get accessible routes based on permissions
    const getAccessibleRoutes = useCallback((outletId = null) => {
        const targetOutletId = outletId || state.currentOutletId;

        const allRoutes = [
            {
                name: 'Home',
                href: '/',
                permission: null // No permission required
            },
            {
                name: 'Order Management',
                href: '/order-history',
                permission: 'ORDER_MANAGEMENT'
            },
            {
                name: 'Staff Management',
                href: '/staff',
                permission: 'STAFF_MANAGEMENT'
            },
            {
                name: 'Inventory Management',
                href: '/inventory',
                permission: 'INVENTORY_MANAGEMENT'
            },
            {
                name: 'Expenditure Management',
                href: '/expenditure',
                permission: 'EXPENDITURE_MANAGEMENT'
            },
            {
                name: 'Wallet Management',
                href: '/wallet',
                permission: 'WALLET_MANAGEMENT'
            },
            {
                name: 'Customer Management',
                href: '/customers',
                permission: 'CUSTOMER_MANAGEMENT'
            },
            {
                name: 'Ticket Management',
                href: '/tickets',
                permission: 'TICKET_MANAGEMENT'
            },
            {
                name: 'Notifications Management',
                href: '/notifications',
                permission: 'NOTIFICATIONS_MANAGEMENT'
            },
            {
                name: 'Product Management',
                href: '/product',
                permission: 'PRODUCT_MANAGEMENT'
            },
            {
                name: 'App Management',
                href: '/app',
                permission: 'APP_MANAGEMENT'
            },
            {
                name: 'Reports & Analytics',
                href: '/reports',
                permission: 'REPORTS_ANALYTICS'
            },
        ];

        return allRoutes.filter(route =>
            !route.permission || hasAdminPermission(route.permission, targetOutletId)
        );
    }, [state.user, state.currentOutletId, hasAdminPermission]);

    // Function to set current outlet
    const setCurrentOutlet = useCallback((outletId) => {
        dispatch({ type: 'SET_CURRENT_OUTLET', payload: outletId });

        // Store in localStorage for persistence
        try {
            localStorage.setItem('currentOutletId', outletId.toString());
        } catch (error) {
            console.error('Error storing current outlet ID:', error);
        }
    }, []);

    // Helper function to get stored outlet ID
    const getStoredOutletId = useCallback(() => {
        try {
            const storedId = localStorage.getItem('currentOutletId');
            return storedId ? parseInt(storedId, 10) : null;
        } catch (error) {
            console.error('Error getting stored outlet ID:', error);
            return null;
        }
    }, []);

    // Helper function to clear stored data
    const clearStoredData = useCallback(() => {
        try {
            localStorage.removeItem('currentOutletId');
        } catch (error) {
            console.error('Error clearing stored data:', error);
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        dispatch({ type: 'LOADING' });
        try {
            const response = await authService.checkAuth();
            if (response && response.user) {
                dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });

                // For admin users, set current outlet from localStorage or default to first outlet
                if (response.user.outlets && response.user.outlets.length > 0) {
                    const storedOutletId = getStoredOutletId();
                    const validOutletId = storedOutletId &&
                        response.user.outlets.some(outlet => outlet.outletId === storedOutletId)
                        ? storedOutletId
                        : response.user.outlets[0].outletId;

                    dispatch({ type: 'SET_CURRENT_OUTLET', payload: validOutletId });
                }
            } else {
                clearStoredData();
                dispatch({ type: 'LOGOUT' });
            }
        } catch (error) {
            clearStoredData();
            dispatch({ type: 'LOGOUT' });
        }
    };

    const signUp = async (userData) => {
        dispatch({ type: 'LOADING' });
        try {
            clearStoredData();
            const response = await authService.signUp(userData);
            dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
            return response;
        } catch (error) {
            dispatch({ type: 'ERROR', payload: error.message });
            throw error;
        }
    };

    const signIn = async (credentials) => {
        dispatch({ type: 'LOADING' });
        try {
            clearStoredData();
            const response = await authService.signIn(credentials);
            console.log('SignIn success:', response);
            dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
            return response;
        } catch (error) {
            console.error('SignIn error:', error);
            dispatch({ type: 'ERROR', payload: error.message });
            throw error;
        }
    };

    const adminSignIn = async (credentials) => {
        dispatch({ type: 'LOADING' });
        try {
            clearStoredData();
            const response = await authService.adminSignIn(credentials);
            console.log('Admin SignIn success:', response);
            dispatch({ type: 'LOGIN_SUCCESS', payload: response.admin });

            // Set default outlet for admin
            if (response.admin.outlets && response.admin.outlets.length > 0) {
                const defaultOutletId = response.admin.outlets[0].outletId;
                dispatch({ type: 'SET_CURRENT_OUTLET', payload: defaultOutletId });
                localStorage.setItem('currentOutletId', defaultOutletId.toString());
            }

            return response;
        } catch (error) {
            console.error('Admin SignIn error:', error);
            dispatch({ type: 'ERROR', payload: error.message });
            throw error;
        }
    };

    const superAdminSignIn = async (credentials) => {
        dispatch({ type: 'LOADING' });
        try {
            clearStoredData();
            const response = await authService.superAdminSignIn(credentials);
            console.log('SuperAdmin SignIn success:', response);
            dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
            return response;
        } catch (error) {
            console.error('SuperAdmin SignIn error:', error);
            dispatch({ type: 'ERROR', payload: error.message });
            throw error;
        }
    };

    const signOut = async () => {
        dispatch({ type: 'LOADING' });
        try {
            await authService.signOut();
            clearStoredData();
            dispatch({ type: 'LOGOUT' });
        } catch (error) {
            dispatch({ type: 'ERROR', payload: error.message });
            clearStoredData();
            dispatch({ type: 'LOGOUT' });
        }
    };

    const value = {
        ...state,
        signUp,
        signIn,
        signOut,
        adminSignIn,
        superAdminSignIn,
        clearError,
        hasAdminPermission,
        getCurrentOutlet,
        getAccessibleOutlets,
        getAccessibleRoutes, // ADD THIS LINE
        setCurrentOutlet,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};