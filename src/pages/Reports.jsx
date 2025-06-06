import React, { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const Reports = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('today')
    const [selectedReport, setSelectedReport] = useState('sales')

    const periods = [
        { key: 'today', label: 'Today' },
        { key: 'week', label: 'This Week' },
        { key: 'month', label: 'This Month' },
        { key: 'custom', label: 'Custom Range' }
    ]

    const reportTypes = [
        { key: 'sales', label: 'Sales Report' },
        { key: 'popular', label: 'Popular Items' },
        { key: 'inventory', label: 'Inventory Usage' },
        { key: 'customer', label: 'Customer Analytics' }
    ]

    return (
        <div className="space-y-6">
            {/*
                // * Filters
             */}

            <Card title="Report Filters">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* 
                        // * Time range
                    */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                        <div className="flex flex-wrap gap-2">
                            {periods.map(period => (
                                <Button
                                    key={period.key}
                                    size="sm"
                                    variant={selectedPeriod === period.key ? 'primary' : 'outline'}
                                    onClick={() => setSelectedPeriod(period.key)}
                                >
                                    {period.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* 
                        // * Type of the report 
                    */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={selectedReport}
                            onChange={(e) => setSelectedReport(e.target.value)}
                        >
                            {reportTypes.map(type => (
                                <option key={type.key} value={type.key}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* 
                        // TODO - need to implement the button functionalites 
                    */}
                    <div className="flex items-end">
                        <Button className="w-full">Generate Report</Button>
                    </div>
                </div>
            </Card>

            {/*
                // *Summary Stats
            */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center">
                    <h3 className="text-2xl font-bold text-blue-600">₹45,230</h3>
                    <p className="text-gray-600">Total Sales</p>
                    <p className="text-xs text-green-600">+12% from yesterday</p>
                </Card>
                <Card className="text-center">
                    <h3 className="text-2xl font-bold text-green-600">156</h3>
                    <p className="text-gray-600">Orders Completed</p>
                    <p className="text-xs text-green-600">+8% from yesterday</p>
                </Card>
                <Card className="text-center">
                    <h3 className="text-2xl font-bold text-orange-600">₹290</h3>
                    <p className="text-gray-600">Average Order Value</p>
                    <p className="text-xs text-red-600">-3% from yesterday</p>
                </Card>
                <Card className="text-center">
                    <h3 className="text-2xl font-bold text-purple-600">89</h3>
                    <p className="text-gray-600">Unique Customers</p>
                    <p className="text-xs text-green-600">+15% from yesterday</p>
                </Card>
            </div>





            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 
                    // * Popular Items
                 */}

                <Card title="Top Selling Items">
                    <div className="space-y-3">
                        {[
                            { name: 'Chicken Biryani', orders: 45, revenue: '₹11,250' },
                            { name: 'Butter Chicken', orders: 32, revenue: '₹8,960' },
                            { name: 'Veg Fried Rice', orders: 28, revenue: '₹5,040' },
                            { name: 'Chicken Wings', orders: 22, revenue: '₹3,960' }
                        ].map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-600">{item.orders} orders</p>
                                </div>
                                <p className="font-semibold text-green-600">{item.revenue}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/*
                    // * Chart Area
                */}
                <Card title="Sales Analytics">
                    <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <p className="text-lg font-medium">Chart Visualization</p>
                            <p className="text-sm">Integration with Chart.js or Recharts would go here</p>
                            <div className="mt-4">
                                <div className="inline-block w-4 h-4 bg-blue-500 rounded mr-2"></div>
                                <span className="text-sm">Sales Data Visualization</span>
                            </div>
                        </div>
                    </div>
                </Card>

            </div>
        </div>
    )
}

export default Reports