import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
            {/* Full-width Header at the top */}
            <div className="w-full z-30">
                <Header onMenuClick={() => setSidebarOpen(true)} />
            </div>

            {/* Body layout: sidebar + content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <div className="absolute inset-0 bg-gray-600 bg-opacity-75"></div>
                    </div>
                )}

                <div className={`
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    fixed lg:relative lg:translate-x-0 z-50 lg:z-auto
                    w-64 h-screen lg:h-full bg-gray-900 transition-transform duration-300 ease-in-out left-0 top-0
                `}>
                    <Sidebar onClose={() => setSidebarOpen(false)} />
                </div>

                {/* Main content */}
                <main className="flex-1 bg-bg p-4 sm:p-6 overflow-auto ml-0">
                    <div className="h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Layout
