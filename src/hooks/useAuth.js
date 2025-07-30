// Add this to your existing useAuth hook or create a separate hook file
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    // Add this function to get accessible routes based on current permissions
    const getAccessibleRoutes = (outletId = null) => {
        const { hasAdminPermission, currentOutletId } = context;
        const targetOutletId = outletId || currentOutletId;

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
    };

    return {
        ...context,
        getAccessibleRoutes
    };
};