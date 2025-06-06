import React, { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'

const Wallet = () => {
    const [showRechargeModal, setShowRechargeModal] = useState(false)
    const [searchText, setSearchText] = useState('')

    // Sample Transaction Data (replace with API call later)
    const transactionData = [
        { id: '#TXN001', name: 'John Doe', date: '2025-06-01', amount: '₹500' },
        { id: '#TXN002', name: 'Jane Smith', date: '2025-06-01', amount: '₹300' },
        { id: '#TXN003', name: 'Mike Johnson', date: '2025-06-01', amount: '₹250' },
        { id: '#TXN004', name: 'Sarah Wilson', date: '2025-06-01', amount: '₹400' }
    ]

    // Filtered data based on search input
    const filteredTransactions = transactionData.filter(txn =>
        txn.id.toLowerCase().includes(searchText.toLowerCase()) ||
        txn.name.toLowerCase().includes(searchText.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Header Row: Wallet Recharge + Manual Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Wallet Recharge</h2>
                <Button variant='success' onClick={() => setShowRechargeModal(true)}>Manual Recharge</Button>
            </div>

            {/* Summary Cards
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center">
                    <h3 className="text-2xl font-bold text-green-600">₹25,340</h3>
                    <p className="text-gray-600">Total Recharges Today</p>
                </Card>
                <Card className="text-center">
                    <h3 className="text-2xl font-bold text-blue-600">45</h3>
                    <p className="text-gray-600">Total Transactions</p>
                </Card>
                <Card className="text-center">
                    <h3 className="text-2xl font-bold text-orange-600">3</h3>
                    <p className="text-gray-600">Pending Recharges</p>
                </Card>
                <Card className="text-center">
                    <h3 className="text-2xl font-bold text-purple-600">₹567</h3>
                    <p className="text-gray-600">Average Recharge</p>
                </Card>
            </div> */}

            {/* Header Row: Recharge History + Search */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Recharge History</h2>
                <input
                    type="text"
                    placeholder="Search by ID or Name"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="border rounded p-2 w-64"
                />
            </div>

            {/* Transactions Table */}
            <Card>
                <Table
                    headers={['Transaction ID', 'Student Name', 'Date', 'Amount']}
                    data={filteredTransactions.map(txn => [
                        txn.id,
                        txn.name,
                        txn.date,
                        txn.amount
                    ])}
                />
            </Card>

            {/* Manual Recharge Modal */}
            <Modal
                isOpen={showRechargeModal}
                onClose={() => setShowRechargeModal(false)}
                title="Manual Recharge"
                footer={
                    <div className="space-x-2">
                        <Button variant="secondary" onClick={() => setShowRechargeModal(false)}>Cancel</Button>
                        <Button>Process Recharge</Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Student ID/Name</label>
                        <input type="text" className="w-full p-2 border rounded" placeholder="Enter student ID or name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input type="number" className="w-full p-2 border rounded" placeholder="Enter amount" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                        <select className="w-full p-2 border rounded">
                            <option>Cash</option>
                            <option>Card</option>
                            <option>UPI</option>
                            <option>Net Banking</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                        <textarea className="w-full p-2 border rounded" rows="3" placeholder="Additional notes"></textarea>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Wallet
