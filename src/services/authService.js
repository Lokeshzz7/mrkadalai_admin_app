import { apiRequest } from '../utils/api.js';
import { API_ENDPOINTS } from '../utils/constants.js';

export const authService = {
    signUp: async (userData) => {
        return await apiRequest(API_ENDPOINTS.SIGN_UP, {
            method: 'POST',
            body: userData,
        });
    },

    signIn: async (credentials) => {
        return await apiRequest(API_ENDPOINTS.SIGN_IN, {
            method: 'POST',
            body: credentials,
        });
    },

    adminSignUp: async (adminData) => {
        return await apiRequest(API_ENDPOINTS.ADMIN_SIGN_UP, {
            method: 'POST',
            body: adminData,
        });
    },

    adminSignIn: async (credentials) => {
        return await apiRequest(API_ENDPOINTS.ADMIN_SIGN_IN, {
            method: 'POST',
            body: credentials,
        });
    },

    staffSignUp: async (staffData) => {
        return await apiRequest(API_ENDPOINTS.STAFF_SIGN_UP, {
            method: 'POST',
            body: staffData,
        });
    },

    staffSignIn: async (credentials) => {
        return await apiRequest(API_ENDPOINTS.STAFF_SIGN_IN, {
            method: 'POST',
            body: credentials,
        });
    },

    superAdminSignIn: async (credentials) => {
        return await apiRequest(API_ENDPOINTS.SUPERADMIN_SIGN_IN, {
            method: 'POST',
            body: credentials,
        });
    },

    signOut: async () => {
        return await apiRequest(API_ENDPOINTS.SIGN_OUT, {
            method: 'POST',
        });
    },

    checkAuth: async () => {
        return await apiRequest('/auth/me', {
            method: 'GET',
        });
    },
};