import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import { apiRequest } from '../utils/api'

const Reports = () => {
    const [searchText, setSearchText] = useState('')
    const [activeTab, setActiveTab] = useState('sales')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [dateRange, setDateRange] = useState({
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0] 
    })

    const [salesReportData, setSalesReportData] = useState([])
    const [revenueReportData, setRevenueReportData] = useState([])
    const [profitLossData, setProfitLossData] = useState([])
    const [customerTrendsData, setCustomerTrendsData] = useState([])

    const outletId = localStorage.getItem('outletId')

    useEffect(() => {
        if (outletId) {
            fetchData()
        }
    }, [outletId, activeTab, dateRange])

    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)

            if (activeTab === 'sales') {
                await fetchSalesReport()
            } else if (activeTab === 'revenue') {
                await fetchRevenueReport()
            } else if (activeTab === 'profit') {
                await fetchProfitLossReport()
            } else if (activeTab === 'customer') {
                await fetchCustomerTrends()
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch data')
            console.error('Error fetching data:', err)
        } finally {
            setLoading(false)
        }
    }

    const fetchSalesReport = async () => {
        try {
            const response = await apiRequest(`/admin/outlets/sales-report/${outletId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: dateRange.from,
                    to: dateRange.to
                })
            })
            setSalesReportData(response || [])
        } catch (error) {
            console.error('Error fetching sales report:', error);
        }
    }

    const fetchRevenueReport = async () => {
        try {
            setRevenueReportData([
                {
                    category: "Food",
                    period: "Today",
                    totalRevenue: 45230,
                    averageOrder: 290,
                    totalOrders: 156,
                    growthRate: 12,
                    lastUpdated: "2024-01-15"
                },
                {
                    category: "Beverages",
                    period: "Today",
                    totalRevenue: 8500,
                    averageOrder: 85,
                    totalOrders: 100,
                    growthRate: 8,
                    lastUpdated: "2024-01-15"
                }
            ])
        } catch (error) {
            console.error('Error fetching revenue report:', error)
            setRevenueReportData([])
        }
    }

    const fetchProfitLossReport = async () => {
        try {
            setProfitLossData([
                {
                    id: 1,
                    category: "Food",
                    period: "Today",
                    revenue: 45230,
                    cost: 30000,
                    profit: 15230,
                    profitMargin: 33.7
                },
                {
                    id: 2,
                    category: "Beverages",
                    period: "Today",
                    revenue: 8500,
                    cost: 3000,
                    profit: 5500,
                    profitMargin: 64.7
                }
            ])
        } catch (error) {
            console.error('Error fetching profit/loss report:', error)
            setProfitLossData([])
        }
    }

    const fetchCustomerTrends = async () => {
        try {
            setCustomerTrendsData([
                {
                    customerId: 1,
                    customerName: "John Doe",
                    totalOrders: 15,
                    totalSpent: 4350,
                    averageOrderValue: 290,
                    lastOrder: "2024-01-15",
                    frequency: "High"
                },
                {
                    customerId: 2,
                    customerName: "Jane Smith",
                    totalOrders: 8,
                    totalSpent: 2240,
                    averageOrderValue: 280,
                    lastOrder: "2024-01-14",
                    frequency: "Medium"
                }
            ])
        } catch (error) {
            console.error('Error fetching customer trends:', error)
            setCustomerTrendsData([])
        }
    }

    const formatCurrency = (amount) => {
        return `₹${amount || 0}`
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-GB');
    }

    const getFilteredData = (data, searchFields) => {
        if (!searchText) return data
        
        return data.filter(item => 
            searchFields.some(field => 
                item[field]?.toString().toLowerCase().includes(searchText.toLowerCase())
            )
        )
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        setSearchText('')
    }

    const handleDownloadReport = () => {
        console.log('Download report for:', activeTab)
    }

    const handleDateRangeChange = (field, value) => {
        setDateRange(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const setQuickDateRange = (days) => {
        const to = new Date().toISOString().split('T')[0]
        const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        setDateRange({ from, to })
    }

    // Check if current date range matches quick button
    const isQuickDateRangeActive = (days) => {
        const expectedFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        const expectedTo = new Date().toISOString().split('T')[0]
        return dateRange.from === expectedFrom && dateRange.to === expectedTo
    }

    // Custom tooltip for the chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                    <p className="font-semibold">{label}</p>
                    <p className="text-blue-600">
                        Orders: {payload[0].value}
                    </p>
                </div>
            )
        }
        return null
    }

    // Custom label function for X-axis to handle long product names
    const CustomXAxisLabel = ({ payload }) => {
        if (payload && payload.value) {
            const maxLength = 15
            return payload.value.length > maxLength 
                ? `${payload.value.substring(0, maxLength)}...`
                : payload.value
        }
        return ''
    }

    // Revenue Report Data Mapping
    const filteredRevenueReport = getFilteredData(revenueReportData, ['category', 'period'])
    const revenueReportMap = filteredRevenueReport.map(revenue => [
        revenue.category,
        revenue.period,
        formatCurrency(revenue.totalRevenue),
        formatCurrency(revenue.averageOrder),
        revenue.totalOrders,
        `${revenue.growthRate}%` || 'N/A',
        formatDate(revenue.lastUpdated)
    ])

    // Profit/Loss Report Data Mapping
    const filteredProfitLossReport = getFilteredData(profitLossData, ['category', 'period'])
    const profitLossReportMap = filteredProfitLossReport.map(profit => [
        profit.category,
        profit.period,
        formatCurrency(profit.revenue),
        formatCurrency(profit.cost),
        formatCurrency(profit.profit),
        `${profit.profitMargin}%` || 'N/A',
        <Badge
            variant={profit.profit > 0 ? 'success' : profit.profit < 0 ? 'danger' : 'secondary'}
            key={profit.id}
        >
            {profit.profit > 0 ? 'Profit' : profit.profit < 0 ? 'Loss' : 'Breakeven'}
        </Badge>
    ])

    // Customer Trends Data Mapping
    const filteredCustomerTrends = getFilteredData(customerTrendsData, ['customerId', 'customerName'])
    const customerTrendsMap = filteredCustomerTrends.map(customer => [
        `#CUST${customer.customerId?.toString().padStart(3, '0') || 'N/A'}`,
        customer.customerName,
        customer.totalOrders,
        formatCurrency(customer.totalSpent),
        formatCurrency(customer.averageOrderValue),
        formatDate(customer.lastOrder),
        <Badge
            variant={customer.frequency === 'High' ? 'success' : 
                    customer.frequency === 'Medium' ? 'pending' : 'secondary'}
            key={customer.customerId}
        >
            {customer.frequency || 'Low'}
        </Badge>
    ])

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold">Reports and Analytics</h1>
                    <Button variant="black">Download Report</Button>
                </div>
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Loading reports data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">Reports and Analytics</h1>
                <Button variant="black" onClick={handleDownloadReport}>
                    Download Report
                </Button>
            </div>

            <div className='flex justify-between items-center'>
                <div className='flex space-x-4'>
                    <Button
                        variant={activeTab === 'sales' ? 'black' : 'secondary'}
                        onClick={() => handleTabChange('sales')}
                    >
                        Sales Report
                    </Button>
                    <Button
                        variant={activeTab === 'revenue' ? 'black' : 'secondary'}
                        onClick={() => handleTabChange('revenue')}
                    >
                        Revenue Report
                    </Button>
                    <Button
                        variant={activeTab === 'profit' ? 'black' : 'secondary'}
                        onClick={() => handleTabChange('profit')}
                    >
                        Profit/Loss Report
                    </Button>
                    <Button
                        variant={activeTab === 'customer' ? 'black' : 'secondary'}
                        onClick={() => handleTabChange('customer')}
                    >
                        Customer Trends
                    </Button>
                </div>
            </div>

            {/* Sales Report Tab */}
            {activeTab === 'sales' && (
                <div className="space-y-4">
                    {/* Date Range Controls */}
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-700">Date Range:</span>
                            <div className="flex space-x-2">
                                <Button 
                                    variant={isQuickDateRangeActive(7) ? 'black' : 'secondary'}
                                    onClick={() => setQuickDateRange(7)}
                                    className="text-sm px-3 py-1"
                                >
                                    7 Days
                                </Button>
                                <Button 
                                    variant={isQuickDateRangeActive(30) ? 'black' : 'secondary'}
                                    onClick={() => setQuickDateRange(30)}
                                    className="text-sm px-3 py-1"
                                >
                                    30 Days
                                </Button>
                                <Button 
                                    variant={isQuickDateRangeActive(90) ? 'black' : 'secondary'}
                                    onClick={() => setQuickDateRange(90)}
                                    className="text-sm px-3 py-1"
                                >
                                    90 Days
                                </Button>
                            </div>
                        </div>
                        
                        {/* Custom Date Range */}
                        <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-700">Custom:</span>
                            <input
                                type="date"
                                value={dateRange.from}
                                onChange={(e) => handleDateRangeChange('from', e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                                type="date"
                                value={dateRange.to}
                                onChange={(e) => handleDateRangeChange('to', e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                        </div>
                    </div>

                    {/* Sales Chart */}
                    <Card title="Sales Report - Products vs Number of Orders">
                        {salesReportData && salesReportData.length > 0 ? (
                            <div className="h-96 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={salesReportData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis 
                                            dataKey="productName"
                                            axisLine={true}
                                            tickLine={true}
                                            tick={{ fontSize: 12, angle: -45, textAnchor: 'end' }}
                                            height={80}
                                            interval={0}
                                        />
                                        <YAxis 
                                            axisLine={true}
                                            tickLine={true}
                                            tick={{ fontSize: 12 }}
                                            label={{ value: 'Number of Orders', angle: -90, position: 'insideLeft' }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar 
                                            dataKey="totalOrders" 
                                            fill="#3b82f6"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="text-center py-16 text-gray-500">
                                No sales data found for the selected date range
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* Error Display */}
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    {error && (
                        <div className="text-red-500 text-sm">
                            Error: {error}
                        </div>
                    )}
                </div>
                {activeTab !== 'sales' && (
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder={
                                activeTab === 'revenue' ? "Search by Category or Period" :
                                activeTab === 'profit' ? "Search by Category or Period" :
                                "Search by Customer ID or Name"
                            }
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="border rounded p-2 w-64"
                        />
                        <Button variant='black' onClick={fetchData}>Refresh</Button>
                    </div>
                )}
            </div>

            {/* Revenue Report Tab */}
            {activeTab === 'revenue' && (
                <Card title='Revenue Report'>
                    {revenueReportMap.length > 0 ? (
                        <Table
                            headers={['Category', 'Period', 'Total Revenue', 'Average Order', 'Total Orders', 'Growth Rate', 'Last Updated']}
                            data={revenueReportMap}
                        />
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No revenue data found
                        </div>
                    )}
                </Card>
            )}

            {/* Profit/Loss Report Tab */}
            {activeTab === 'profit' && (
                <Card title='Profit/Loss Report'>
                    {profitLossReportMap.length > 0 ? (
                        <Table
                            headers={['Category', 'Period', 'Revenue', 'Cost', 'Profit/Loss', 'Margin %', 'Status']}
                            data={profitLossReportMap}
                        />
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No profit/loss data found
                        </div>
                    )}
                </Card>
            )}

            {/* Customer Trends Tab */}
            {activeTab === 'customer' && (
                <Card title='Customer Trends'>
                    {customerTrendsMap.length > 0 ? (
                        <Table
                            headers={['Customer ID', 'Customer Name', 'Total Orders', 'Total Spent', 'Avg Order Value', 'Last Order', 'Frequency']}
                            data={customerTrendsMap}
                        />
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No customer trends data found
                        </div>
                    )}
                </Card>
            )}
        </div>
    )
}

export default Reports