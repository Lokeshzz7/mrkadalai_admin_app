import React, { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'

const Inventory = () => {
    const [showAddModal, setShowAddModal] = useState(false)
    const [activeTab, setActiveTab] = useState('stock')
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [searchTerm, setSearchTerm] = useState('')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
    const [filteredHistory, setFilteredHistory] = useState([])

    const items = ['Tomatoes', 'Onions', 'Chicken', 'Rice']

    const stockData = [
    ['Tomatoes', 'Food Items', '5 kg'],
    ['Onions', 'Food Items', '15 kg'],
    ['Chicken', 'Raw Ingredients', '8 kg'],
    ['Rice', 'Raw Ingredients', '3 kg']
    ]


    const activityData = [
    ['Tomatoes', 'Food Items', '2024-01-15', '10 kg Added'],
    ['Chicken', 'Raw Ingredients', '2024-01-15', '2 kg Deducted'],
    ['Rice', 'Raw Ingredients', '2024-01-14', '5 kg Added'],
    ['Onions', 'Food Items', '2024-01-14', '3 kg Deducted']
    ]


    const filteredStock = stockData.filter(([item, category]) => {
    const categoryMatch = categoryFilter === 'All' || category === categoryFilter
    const searchMatch = item.toLowerCase().includes(searchTerm.toLowerCase())
    return categoryMatch && searchMatch
    })


    const handleApplyDateFilter = () => {
        if (!dateFrom || !dateTo) return
        const from = new Date(dateFrom)
        const to = new Date(dateTo)

        const filtered = activityData.filter(([_, __, date]) => {
            const current = new Date(date)
            return current >= from && current <= to
        })

        setFilteredHistory(filtered)
    }

    return (
        <div className="space-y-6">
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
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="All">All Categories</option>
                        <option value="Food Items">Food Items</option>
                        <option value="Raw Ingredients">Raw Ingredients</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search item"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded"
                    />
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
                    <Button variant="black" onClick={handleApplyDateFilter}>
                        Apply
                    </Button>
                </div>
            )}

            {/* Content */}
            {activeTab === 'stock' && (
                <Card title="Current Stock Status">
                    <Table
                        headers={['Item', 'Category', 'Available Stock', 'Actions']}
                        data={filteredStock.map(([item, category, stock]) => [
                            item,
                            category,
                            stock,
                            <div className="flex space-x-2">
                                <Button
                                    variant="success"
                                    className="px-3 py-1 text-xs"
                                    onClick={() => setShowAddModal(true)}
                                >
                                    Add
                                </Button>
                                <Button
                                    variant="danger"
                                    className="px-3 py-1 text-xs"
                                    onClick={() => alert(`Deduct clicked for ${item}`)}
                                >
                                    Deduct
                                </Button>
                            </div>
                        ])}
                    />
                </Card>
            )}

            {activeTab === 'activity' && (
                <Card title="Stock History">
                    <Table
                        headers={['Item', 'Category', 'Date', 'Quantity']}
                        data={filteredHistory.length ? filteredHistory : activityData}
                    />
                </Card>
            )}

            {/* Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add Stock"
                footer={
                    <div className="space-x-2">
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                        <Button>Add Stock</Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                        <select className="w-full p-2 border rounded">
                            <option>Select Item</option>
                            {items.map(item => (
                                <option key={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input type="number" className="w-full p-2 border rounded" placeholder="Enter quantity" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                        <select className="w-full p-2 border rounded">
                            <option>kg</option>
                            <option>grams</option>
                            <option>pieces</option>
                            <option>liters</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Inventory
