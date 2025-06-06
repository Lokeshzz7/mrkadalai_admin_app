import React from 'react'

const Table = ({ headers, data, className = '' }) => {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-list">
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table