import React, { useState, useEffect } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import { apiRequest } from '../utils/api'

const Wallet = () => {
    const [searchText, setSearchText] = useState('')
    const [activeTab, setActiveTab] = useState('summary')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [walletSummaryData, setWalletSummaryData] = useState([])
    const [rechargeHistoryData, setRechargeHistoryData] = useState([])
    const [paidOrdersData, setPaidOrdersData] = useState([])

    const outletId = localStorage.getItem('outletId')

    useEffect(() => {
        if (outletId) {
            fetchData()
        }
    }, [outletId, activeTab])

    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)

            if (activeTab === 'summary') {
                await fetchWalletSummary()
            } else if (activeTab === 'history') {
                await fetchRechargeHistory()
            } else if (activeTab === 'orders') {
                await fetchPaidOrders()
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch data')
            console.error('Error fetching data:', err)
        } finally {
            setLoading(false)
        }
    }

    const fetchWalletSummary = async () => {
        const response = await apiRequest(`/superadmin/outlets/wallet-history/${outletId}/`)
        setWalletSummaryData(response.data || [])
    }

    const fetchRechargeHistory = async () => {
        const response = await apiRequest(`/superadmin/outlets/recharge-history/${outletId}/`)
        setRechargeHistoryData(response.data || [])
    }

    const fetchPaidOrders = async () => {
        const response = await apiRequest('/superadmin/outlets/paid-wallet/')
        setPaidOrdersData(response.data || [])
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

    // Wallet Summary Data Mapping
    const filteredWalletSummary = getFilteredData(walletSummaryData, ['walletId', 'name'])
    const walletSummaryMap = filteredWalletSummary.map(wallet => [
        `#WLT${wallet.walletId?.toString().padStart(3, '0') || 'N/A'}`,
        wallet.name,
        formatCurrency(wallet.balance),
        formatCurrency(wallet.totalRecharged),
        formatCurrency(wallet.totalUsed),
        formatDate(wallet.lastRecharged),
        formatDate(wallet.lastOrder)
    ])

    // Recharge History Data Mapping
    const filteredRechargeHistory = getFilteredData(rechargeHistoryData, ['rechargeId', 'customerName'])
    const rechargeHistoryMap = filteredRechargeHistory.map(recharge => [
        `#RCH${recharge.rechargeId?.toString().padStart(3, '0')}`,
        recharge.customerName,
        formatCurrency(recharge.amount),
        formatDate(recharge.date),
        recharge.method || 'N/A',
        <Badge
            variant={recharge.status?.toLowerCase() === 'completed' ? 'success' :
                recharge.status?.toLowerCase() === 'pending' ? 'pending' : 'secondary'}
            key={recharge.rechargeId}
        >
            {recharge.status || 'Unknown'}
        </Badge>
    ])

    // Paid Orders Data Mapping
    const filteredPaidOrders = getFilteredData(paidOrdersData, ['orderId', 'customerName'])
    const paidOrdersMap = filteredPaidOrders.map(order => [
        `#ORD${order.orderId?.toString().padStart(3, '0')}`,
        order.customerName,
        formatCurrency(order.orderTotal),
        formatDate(order.orderDate),
        <Badge
            variant="success"
            key={order.orderId}
        >
            Wallet Paid
        </Badge>
    ])

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        setSearchText('')
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-4xl font-bold">Wallet Recharge</h1>
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Loading wallet data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold">Wallet Recharge</h1>

            <div className='flex justify-between items-center'>
                <div className='flex space-x-4'>
                    <Button
                        variant={activeTab === 'summary' ? 'black' : 'secondary'}
                        onClick={() => handleTabChange('summary')}
                    >
                        Wallet Summary
                    </Button>
                    <Button
                        variant={activeTab === 'history' ? 'black' : 'secondary'}
                        onClick={() => handleTabChange('history')}
                    >
                        Recharge History
                    </Button>
                    <Button
                        variant={activeTab === 'orders' ? 'black' : 'secondary'}
                        onClick={() => handleTabChange('orders')}
                    >
                        Paid orders
                    </Button>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    {error && (
                        <div className="text-red-500 text-sm">
                            Error: {error}
                        </div>
                    )}
                </div>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder={
                            activeTab === 'summary' ? "Search by Wallet ID or Name" :
                                activeTab === 'history' ? "Search by Recharge ID or Name" :
                                    "Search by Order ID or Name"
                        }
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="border rounded p-2 w-64"
                    />
                    <Button variant='black' onClick={fetchData}>Refresh</Button>
                </div>
            </div>

            {/* Wallet Summary Tab */}
            {activeTab === 'summary' && (
                <Card title='Wallet Summary'>
                    {walletSummaryMap.length > 0 ? (
                        <Table
                            headers={['Wallet ID', 'Customer Name', 'Wallet Balance', 'Total Recharged', 'Total Used', 'Last Recharge', 'Last Order']}
                            data={walletSummaryMap}
                        />
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No wallet data found
                        </div>
                    )}
                </Card>
            )}

            {/* Recharge History Tab */}
            {activeTab === 'history' && (
                <Card title='Recharge History'>
                    {rechargeHistoryMap.length > 0 ? (
                        <Table
                            headers={['Recharge ID', 'Customer Name', 'Amount', 'Date', 'Payment Method', 'Status']}
                            data={rechargeHistoryMap}
                        />
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No recharge history found
                        </div>
                    )}
                </Card>
            )}

            {/* Paid Orders Tab */}
            {activeTab === 'orders' && (
                <Card title='Paid Orders'>
                    {paidOrdersMap.length > 0 ? (
                        <Table
                            headers={['Order ID', 'Customer Name', 'Amount', 'Date', 'Payment Status']}
                            data={paidOrdersMap}
                        />
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No paid orders found
                        </div>
                    )}
                </Card>
            )}
        </div>
    )
}

export default Wallet