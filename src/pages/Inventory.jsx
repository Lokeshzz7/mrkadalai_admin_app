import React, { useState, useEffect } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import { apiRequest } from '../utils/api'

const Inventory = () => {
    const getFormattedDate = (date) => {
        return date.toISOString().split('T')[0];
    }

    const today = new Date();
    const oneWeekBefore = new Date();
    oneWeekBefore.setDate(today.getDate() - 7);

    const [showAddModal, setShowAddModal] = useState(false)
    const [activeTab, setActiveTab] = useState('stock')
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [searchTerm, setSearchTerm] = useState('')
    const [dateFrom, setDateFrom] = useState(getFormattedDate(oneWeekBefore));
    const [dateTo, setDateTo] = useState(getFormattedDate(today));
    const [filteredHistory, setFilteredHistory] = useState([])
    const [selectedItem, setSelectedItem] = useState(null)
    const [modalMode, setModalMode] = useState('add')
    const [quantity, setQuantity] = useState('')
    const [stockData, setStockData] = useState([])
    const [activityData, setActivityData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [modalLoading, setModalLoading] = useState(false)

    const outletId = localStorage.getItem('outletId');

    useEffect(() => {
        fetchStocks()
        fetchStockHistory()
    }, [])

    const fetchStocks = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await apiRequest(`/superadmin/outlets/get-stocks/${outletId}`)
            if (response.stocks) {
                const transformedData = response.stocks.map(stock => [
                    stock.name,
                    stock.category,
                    `${stock.quantity} kg`,
                    stock.id,
                    stock.price,
                    stock.threshold
                ])
                setStockData(transformedData)
            }
        } catch (err) {
            setError(err.message)
            console.error('Error fetching stocks:', err)
        } finally {
            setLoading(false)
        }
    }

    const fetchStockHistory = async () => {
        if (!dateFrom || !dateTo) {
            setError('Please select both from and to dates')
            return
        }

        setLoading(true)
        setError('')
        try {
            const response = await apiRequest('/superadmin/outlets/get-stock-history', {
                method: 'POST',
                body: {
                    outletId,
                    startDate: dateFrom,
                    endDate: dateTo
                }
            })

            if (response.history) {
                const transformedHistory = response.history.map(item => [
                    item.product.name,
                    item.product.category,
                    new Date(item.timestamp).toISOString().split('T')[0],
                    `${item.quantity} kg ${item.action === 'ADD' ? 'Added' : 'Deducted'}`
                ])
                setActivityData(transformedHistory)
                setFilteredHistory(transformedHistory)
            }
        } catch (err) {
            setError(err.message)
            console.error('Error fetching stock history:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddStock = async () => {
        if (!quantity || !selectedItem) {
            setError('Please enter a valid quantity')
            return
        }

        setModalLoading(true)
        setError('')
        try {
            const response = await apiRequest('/superadmin/outlets/add-stocks/', {
                method: 'POST',
                body: {
                    productId: selectedItem.id,
                    outletId,
                    addedQuantity: parseInt(quantity)
                }
            })

            console.log('Add stock response:', response)

            handleCloseModal()
            await fetchStocks()
            console.log('Stock added successfully')

        } catch (err) {
            setError(err.message || 'Error adding stock')
            console.error('Error adding stock:', err)
        } finally {
            setModalLoading(false)
        }
    }

    const handleDeductStock = async () => {
        if (!quantity || !selectedItem) {
            setError('Please enter a valid quantity')
            return
        }

        setModalLoading(true)
        setError('')
        try {
            const response = await apiRequest('/superadmin/outlets/deduct-stocks/', {
                method: 'POST',
                body: {
                    productId: selectedItem.id,
                    outletId,
                    quantity: parseInt(quantity)
                }
            })

            console.log('Deduct stock response:', response)

            handleCloseModal()

            await fetchStocks()
            console.log('Stock deducted successfully')

        } catch (err) {
            setError(err.message || 'Error deducting stock')
            console.error('Error deducting stock:', err)
        } finally {
            setModalLoading(false)
        }
    }

    const handleStockAction = () => {
        if (modalMode === 'add') {
            handleAddStock()
        } else {
            handleDeductStock()
        }
    }

    const handleClearDateFilter = () => {
        setDateFrom('')
        setDateTo('')
        setFilteredHistory([])
        setActivityData([])
    }

    const filteredStock = stockData.filter(([item, category]) => {
        const categoryMatch = categoryFilter === 'All' || category === categoryFilter
        const searchMatch = item.toLowerCase().includes(searchTerm.toLowerCase())
        return categoryMatch && searchMatch
    })

    const handleCloseModal = () => {
        setShowAddModal(false)
        setSelectedItem(null)
        setQuantity('')
        setError('')
        setModalLoading(false)
    }

    const handleApplyDateFilter = () => {
        fetchStockHistory()
    }

    return (
        <div className="space-y-6">
            {/* Error Display */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                    <Button
                        variant={activeTab === 'stock' ? 'black' : 'secondary'}
                        onClick={() => setActiveTab('stock')}
                    >
                        Stock Availability
                    </Button>
                    <Button
                        variant={activeTab === 'activity' ? 'black' : 'secondary'}
                        onClick={() => setActiveTab('activity')}
                    >
                        Stock History
                    </Button>
                </div>
            </div>

            {/* Filters */}
            {activeTab === 'stock' && (
                <div className="flex justify-between items-center flex-wrap">
                    <div className="flex items-center gap-2">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="p-2 border rounded"
                        >
                            <option value="All">All Categories</option>
                            <option value="Meals">Meals</option>
                            <option value="Starters">Starters</option>
                            <option value="Desserts">Desserts</option>
                            <option value="Beverages">Beverages</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Search item"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2 border rounded"
                        />
                        <Button variant="black" onClick={fetchStocks} disabled={loading}>
                            {loading ? 'Refreshing...' : 'Refresh'}
                        </Button>
                    </div>
                </div>

            )}

            {activeTab === 'activity' && (
                <div className="flex space-x-4 items-end">
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">From Date</label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">To Date</label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="p-2 border rounded"
                        />
                    </div>
                    <Button variant="black" onClick={handleApplyDateFilter} disabled={loading}>
                        {loading ? 'Loading...' : 'Apply'}
                    </Button>
                    <Button variant="secondary" onClick={handleClearDateFilter}>
                        Clear
                    </Button>
                </div>
            )}

            {/* Content */}
            {activeTab === 'stock' && (
                <Card title="Current Stock Status">
                    {loading ? (
                        <div className="text-center py-4">Loading stocks...</div>
                    ) : (
                        <Table
                            headers={['Item', 'Category', 'Price', 'Threshold', 'Available Stock', 'Actions']}
                            data={filteredStock.map(([item, category, stock, id, price, threshold]) => [
                                item,
                                category,
                                `$${price.toFixed(2)}`,
                                threshold,
                                stock,
                                <div className="flex space-x-2">
                                    <Button
                                        variant="success"
                                        className="px-3 py-1 text-xs"
                                        onClick={() => {
                                            setSelectedItem({ item, category, stock, id, price, threshold })
                                            setModalMode('add')
                                            setShowAddModal(true)
                                        }}
                                    >
                                        Add
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="px-3 py-1 text-xs"
                                        onClick={() => {
                                            setSelectedItem({ item, category, stock, id, price, threshold })
                                            setModalMode('deduct')
                                            setShowAddModal(true)
                                        }}
                                    >
                                        Deduct
                                    </Button>
                                </div>
                            ])}
                        />
                    )}
                </Card>
            )}

            {activeTab === 'activity' && (
                <Card title="Stock History">
                    {loading ? (
                        <div className="text-center py-4">Loading history...</div>
                    ) : (
                        <Table
                            headers={['Item', 'Category', 'Date', 'Quantity']}
                            data={filteredHistory.length ? filteredHistory : activityData}
                        />
                    )}
                </Card>
            )}

            {/* Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={handleCloseModal}
                title={`${modalMode === 'add' ? 'Add' : 'Deduct'} Stock`}
                footer={
                    <div className="space-x-2">
                        <Button
                            variant="secondary"
                            onClick={handleCloseModal}
                            disabled={modalLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={modalMode === 'add' ? 'success' : 'danger'}
                            onClick={handleStockAction}
                            disabled={modalLoading || !quantity}
                        >
                            {modalLoading ? 'Processing...' : (modalMode === 'add' ? 'Add Stock' : 'Deduct Stock')}
                        </Button>
                    </div>
                }
            >
                {selectedItem && (
                    <div className="space-y-4">
                        {/* Modal Error Display */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                                {error}
                            </div>
                        )}

                        {/* Table-style display for item details */}
                        <table className="w-full text-sm border border-gray-300 rounded">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 border border-gray-300 text-left">Item</th>
                                    <th className="p-2 border border-gray-300 text-left">Category</th>
                                    <th className="p-2 border border-gray-300 text-left">Current Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-2 border border-gray-300">{selectedItem.item}</td>
                                    <td className="p-2 border border-gray-300">{selectedItem.category}</td>
                                    <td className="p-2 border border-gray-300">{selectedItem.stock}</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Quantity input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity to {modalMode === 'add' ? 'Add' : 'Deduct'}
                            </label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder={`Enter quantity to ${modalMode === 'add' ? 'add' : 'deduct'}`}
                                min="1"
                                disabled={modalLoading}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default Inventory