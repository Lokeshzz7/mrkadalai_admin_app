import React, { useContext } from 'react'
import { Search, Bell, User, Menu } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import logo from '../assets/logo.png'

const Header = ({ onMenuClick }) => {
    const { user, signOut } = useContext(AuthContext)

    // !  Extract email from the (context) instaed of the name as of now 
    const userName = user?.email?.split('@')[0] || 'Guest'

    return (
        <header className="bg-header shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Mobile menu button */}
                    <button
                        type="button"
                        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        onClick={onMenuClick}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <img src={logo} alt="logo" className="h-8 w-auto" />

                    {/* Left Section  - SearchBar */}
                    <div className="flex-1 max-w-md mx-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Search orders, customers..."
                            />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Notifications */}
                        <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                            <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                        </button>

                        {/* Profile */}
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="flex-shrink-0">
                                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-theme flex items-center justify-center">
                                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-xs sm:text-sm font-medium text-gray-900">{userName}</div>
                                <div className="text-xs text-gray-500">Restaurant Manager</div>
                            </div>
                        </div>

                        {/* Logout button */}
                        {/* <button
                            onClick={signOut}
                            className="ml-2 px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Logout
                        </button> */}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
