    import React from 'react';
    import { Navigate, useLocation } from 'react-router-dom';
    import { useAuth } from '../hooks/useAuth.js';
    import { ROUTES } from '../utils/constants.js';
import Loader from './ui/Loader.jsx';

    const ProtectedRoute = ({ children }) => {
        const { isAuthenticated, loading } = useAuth();
        const location = useLocation();

        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="flex items-center justify-center"><Loader/></div>
                </div>
            );
        }

        if (!isAuthenticated) {
            // * Redirection 
            return <Navigate to={ROUTES.SIGN_IN} state={{ from: location }} replace />;
        }

        return children;
    };

    export default ProtectedRoute;