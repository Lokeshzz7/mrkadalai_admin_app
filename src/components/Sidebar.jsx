import React, { useContext } from 'react'
import { href, NavLink } from 'react-router-dom'
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
    ChefHat
} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

const Sidebar = ({ onClose }) => {
    const { user, signOut } = useContext(AuthContext)
    const navigation = [
        {name:'Home',href:'/',icon: LayoutDashboard},
        // { name: 'Dashboard', href: '/home', icon: LayoutDashboard },
        { name: 'Order Management', href: '/order-history', icon: Clock },
        { name: 'Staff Management', href: '/staff', icon: Bell },
        { name: 'Inventory Management', href: '/inventory', icon: Package },
        { name: 'Expenditure Management', href: '/expenditure', icon: PlusCircle },
        { name: 'Wallet Management', href: '/wallet', icon: Wallet },
        { name: 'Customer Management', href: '/customers', icon: PersonStanding },
        { name: 'Ticket Management', href: '/tickets', icon: Ticket },
        { name: 'Notifications Management', href: '/notifications', icon: Bell },
        { name: 'Product Management', href: '/product', icon: ChefHat },
        { name: 'App Management', href: '/app', icon: Wallet },
        { name: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
    ]

    return (
        <div className="bg-nav text-primary w-64 h-full flex flex-col overflow-hidden">
            {/* Logo and close button */}
            <div className="lg:hidden p-6 flex items-center justify-between">
                {/* Close button (only mobile) */}
                <button
                    type="button"
                    className="lg:hidden p-1 rounded-md text-primary hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={onClose}
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <ul className="space-y-2">
                    {navigation.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.href}
                                onClick={() => onClose && onClose()}
                                className={({ isActive }) =>
                                    `flex items-center px-2 py-[5.9px] text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? 'bg-black text-white'
                                        : 'text-primary hover:bg-none hover:text-black'
                                    }`
                                }
                            >
                                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                <span className="truncate">{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-700">
                <NavLink
                    to="/settings"
                    onClick={() => onClose && onClose()}
                    className={({ isActive }) =>
                        `flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                            ? 'bg-theme text-white'
                            : 'text-primary hover:bg-gray-800 hover:text-white'
                        }`
                    }
                >
                    <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="truncate">Settings</span>
                </NavLink>

                <button
                    onClick={signOut} className="flex items-center w-full px-4 py-2 text-sm font-medium text-primary rounded-lg hover:bg-gray-800 hover:text-white transition-colors mt-2">
                    <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="truncate">Logout</span>
                </button>
            </div>
        </div>
    )
}

export default Sidebar