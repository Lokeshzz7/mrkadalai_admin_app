import React from 'react'

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    onClick,
    className = '',
    type = 'button',
    ...props
}) => {
    const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none'

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
        warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 disabled:bg-yellow-300',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 disabled:bg-gray-50',
        black: 'bg-black text-white hover:bg-gray-900 disabled:bg-gray-500',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    }

    return (
        <button
            type={type}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button