import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    Bell,
    PlusCircle,
    Package,
    Wallet,
    BarChart3,
    Settings,
    LogOut,
    X,
    Clock,
    Ticket,
    PersonStanding,
    ChefHat,
    Building2,
    Crown
} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { useAuth } from '../hooks/useAuth'

const AdminSidebar = ({ onClose }) => {
    const { user, signOut, currentOutletId } = useContext(AuthContext)
    const { hasAdminPermission, getCurrentOutlet, getAccessibleOutlets, setCurrentOutlet, isSuperAdmin } = useAuth()

    const navigation = [
        {
            name: 'Home',
            href: '/',
            icon: LayoutDashboard,
            permission: null
        },
        {
            name: 'Order Management',
            href: '/order-history',
            icon: Clock,
            permission: 'ORDER_MANAGEMENT'
        },
        {
            name: 'Staff Management',
            href: '/staff',
            icon: Bell,
            permission: 'STAFF_MANAGEMENT'
        },
        {
            name: 'Inventory Management',
            href: '/inventory',
            icon: Package,
            permission: 'INVENTORY_MANAGEMENT'
        },
        {
            name: 'Expenditure Management',
            href: '/expenditure',
            icon: PlusCircle,
            permission: 'EXPENDITURE_MANAGEMENT'
        },
        {
            name: 'Wallet Management',
            href: '/wallet',
            icon: Wallet,
            permission: 'WALLET_MANAGEMENT'
        },
        {
            name: 'Customer Management',
            href: '/customers',
            icon: PersonStanding,
            permission: 'CUSTOMER_MANAGEMENT'
        },
        {
            name: 'Ticket Management',
            href: '/tickets',
            icon: Ticket,
            permission: 'TICKET_MANAGEMENT'
        },
        {
            name: 'Notifications Management',
            href: '/notifications',
            icon: Bell,
            permission: 'NOTIFICATIONS_MANAGEMENT'
        },
        {
            name: 'Product Management',
            href: '/product',
            icon: ChefHat,
            permission: 'PRODUCT_MANAGEMENT'
        },
        {
            name: 'App Management',
            href: '/app',
            icon: Wallet,
            permission: 'APP_MANAGEMENT'
        },
        {
            name: 'Reports & Analytics',
            href: '/reports',
            icon: BarChart3,
            permission: 'REPORTS_ANALYTICS'
        },
    ]

    // Super admin has access to everything, regular admin needs permission check
    const hasAccess = (item) => {
        return !item.permission || hasAdminPermission(item.permission, currentOutletId);
    }

    const getNavLinkClass = (item, isActive) => {
        const baseClass = 'flex items-center px-2 py-[5.9px] text-sm font-medium rounded-lg transition-colors';
        
        if (isActive) {
            return `${baseClass} bg-black text-white`;
        }
        
        return `${baseClass} text-primary hover:bg-none hover:text-black`;
    }

    const renderNavItem = (item) => {
        const hasUserAccess = hasAccess(item);

        // For super admin, show all items as accessible
        // For regular admin, show locked items if no access
        if (!hasUserAccess && !isSuperAdmin()) {
            return (
                <li key={item.name}>
                    <div
                        className="flex items-center px-2 py-[5.9px] text-sm font-medium rounded-lg transition-colors text-gray-500 cursor-not-allowed opacity-50"
                        title={`You don't have permission to access ${item.name} for this outlet`}
                    >
                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                    </div>
                </li>
            );
        }

        return (
            <li key={item.name}>
                <NavLink
                    to={item.href}
                    onClick={() => onClose && onClose()}
                    className={({ isActive }) => getNavLinkClass(item, isActive)}
                >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                </NavLink>
            </li>
        );
    }

    const currentOutlet = getCurrentOutlet();
    const accessibleOutlets = getAccessibleOutlets();

    const handleOutletChange = (outletId) => {
        setCurrentOutlet(parseInt(outletId));
    };

    return (
        <div className="bg-nav text-primary w-64 h-full flex flex-col overflow-hidden">
            {/* Logo and close button */}
            <div className="lg:hidden p-6 flex items-center justify-between">
                <button
                    type="button"
                    className="lg:hidden p-1 rounded-md text-primary hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={onClose}
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            {/* Super Admin Indicator */}
            {isSuperAdmin() && (
                <div className="px-4 py-2 border-b border-gray-700">
                    <div className="flex items-center justify-center bg-gradient-to-r from-yellow-600 to-yellow-500 text-white text-xs font-bold py-2 px-3 rounded-lg">
                        <Crown className="h-4 w-4 mr-2" />
                        SUPER ADMIN
                    </div>
                </div>
            )}

            {/* Outlet Selector - Only for regular admins with multiple outlets */}
            {!isSuperAdmin() && accessibleOutlets.length > 1 && (
                <div className="px-4 py-2 border-b border-gray-700">
                    <label className="block text-xs font-medium text-gray-400 mb-2">
                        Current Outlet
                    </label>
                    <div className="relative">
                        <select
                            value={currentOutletId || ''}
                            onChange={(e) => handleOutletChange(e.target.value)}
                            className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                            {accessibleOutlets.map((outlet) => (
                                <option key={outlet.id} value={outlet.id}>
                                    {outlet.name}
                                </option>
                            ))}
                        </select>
                        <Building2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    {currentOutlet && (
                        <p className="text-xs text-gray-400 mt-1 truncate">
                            {currentOutlet.outlet.address}
                        </p>
                    )}
                </div>
            )}

            {/* Current outlet info for single outlet regular admins */}
            {!isSuperAdmin() && accessibleOutlets.length === 1 && currentOutlet && (
                <div className="px-4 py-2 border-b border-gray-700">
                    <div className="flex items-center">
                        <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                            <p className="text-sm font-medium text-white truncate">
                                {currentOutlet.outlet.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                                {currentOutlet.outlet.address}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Super Admin Global Access Info */}
            {isSuperAdmin() && (
                <div className="px-4 py-2 border-b border-gray-700">
                    <div className="flex items-center">
                        <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                            <p className="text-sm font-medium text-white truncate">
                                Global Access
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                                All outlets and functions
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <ul className="space-y-2">
                    {navigation.map(renderNavItem)}
                </ul>
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-700">
                <NavLink
                    to="/settings"
                    onClick={() => onClose && onClose()}
                    className={({ isActive }) =>
                        `flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            isSuperAdmin() || hasAdminPermission('SETTINGS', currentOutletId)
                                ? isActive
                                    ? 'bg-theme text-white'
                                    : 'text-primary hover:bg-gray-800 hover:text-white'
                                : 'text-gray-500 cursor-not-allowed opacity-50'
                        }`
                    }
                    style={!isSuperAdmin() && !hasAdminPermission('SETTINGS', currentOutletId) ? { pointerEvents: 'none' } : {}}
                >
                    <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="truncate">Settings</span>
                </NavLink>

                <button
                    onClick={signOut}
                    className="flex items-center w-full px-4 py-2 text-sm font-medium text-primary rounded-lg hover:bg-gray-800 hover:text-white transition-colors mt-2"
                >
                    <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="truncate">Logout</span>
                </button>
            </div>
        </div>
    )
}

export default AdminSidebar