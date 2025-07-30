import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Component to wrap routes that need permission checking for admins
const AdminPermissionRoute = ({
    children,
    requiredPermission,
    fallbackComponent = null,
    showDisabled = false, // Changed default to false for route protection
    redirectTo = null // Where to redirect if no permission
}) => {
    const { hasAdminPermission, currentOutletId, getAccessibleRoutes } = useAuth();

    // If no permission required, render normally
    if (!requiredPermission) {
        return children;
    }

    const hasAccess = hasAdminPermission(requiredPermission, currentOutletId);

    // If user doesn't have permission
    if (!hasAccess) {
        // If showDisabled is true, render with disabled styling (for components, not routes)
        if (showDisabled) {
            return (
                <div
                    style={{
                        pointerEvents: 'none',
                        opacity: 0.5,
                        cursor: 'not-allowed'
                    }}
                    title="You don't have permission to access this feature for this outlet"
                >
                    {children}
                </div>
            );
        }

        // If specific redirect provided, use it
        if (redirectTo) {
            return <Navigate to={redirectTo} replace />;
        }

        // Find the first accessible route for this user
        const accessibleRoutes = getAccessibleRoutes(currentOutletId);
        if (accessibleRoutes.length > 0) {
            return <Navigate to={accessibleRoutes[0].href} replace />;
        }

        // If no accessible routes, redirect to home
        return <Navigate to="/" replace />;
    }

    // User has permission, render normally
    return children;
};



export default AdminPermissionRoute;