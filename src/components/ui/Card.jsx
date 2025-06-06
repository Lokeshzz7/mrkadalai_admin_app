import React from 'react'

const Card = ({ children, className = '', title,Black = false, ...props }) => {
    const border = Black ? 'border-black' : 'border-gray-200'
    return (
        <div className={`bg-white rounded-lg shadow-sm border ${border} ${className}`} {...props}>
            {title && (
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>
            )}
            <div className={title ? 'p-6' : 'p-6'}>
                {children}
            </div>
        </div>
    )
}

export default Card