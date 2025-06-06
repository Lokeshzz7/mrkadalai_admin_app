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
        case 'LOGOUT':
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
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
    loading: true,
    error: null,
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);


    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' });
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
            } else {
                dispatch({ type: 'LOGOUT' });
            }
        } catch (error) {
            dispatch({ type: 'LOGOUT' });
        }
    };

    const signUp = async (userData) => {
        dispatch({ type: 'LOADING' });
        try {
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


    const signOut = async () => {
        dispatch({ type: 'LOADING' });
        try {
            await authService.signOut();
            dispatch({ type: 'LOGOUT' });
        } catch (error) {
            dispatch({ type: 'ERROR', payload: error.message });
            dispatch({ type: 'LOGOUT' });
        }
    };

    const value = {
        ...state,
        signUp,
        signIn,
        signOut,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };