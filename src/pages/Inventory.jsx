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
    const [selectedItem, setSelectedItem] = useState(null)
    const [modalMode, setModalMode] = useState('add') 


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

    const handleClearDateFilter = () => {
    setDateFrom('')
    setDateTo('')
    setFilteredHistory([])
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
    }



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
                    <Button variant="secondary" onClick={handleClearDateFilter}>
                        Clear
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
                                    onClick={() => {
                                        setSelectedItem({ item, category, stock })
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
                                        setSelectedItem({ item, category, stock })
                                        setModalMode('deduct')
                                        setShowAddModal(true)
                                    }}
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
            {/* Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={handleCloseModal}
                title={`${modalMode === 'add' ? 'Add' : 'Deduct'} Stock`}
                footer={
                    <div className="space-x-2">
                        <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button variant={modalMode === 'add' ? 'success' : 'danger'}>
                            {modalMode === 'add' ? 'Add Stock' : 'Deduct Stock'}
                        </Button>
                    </div>
                }
            >
                {selectedItem && (
                    <div className="space-y-4">
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
                                className="w-full p-2 border rounded"
                                placeholder={`Enter quantity to ${modalMode === 'add' ? 'add' : 'deduct'}`}
                            />
                        </div>
                    </div>
                )}
            </Modal>

        </div>
    )
}

export default Inventory
