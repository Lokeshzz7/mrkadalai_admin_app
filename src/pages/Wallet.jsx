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

    const transactionmap = filteredTransactions.map(txn => [
        txn.id,
        txn.name,
        txn.date,
        txn.amount
    ])

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold">Wallet Recharge</h1>

            <div>
                <div className=''>

                </div>
            </div>

            <div className="flex justify-end items-center">
                <input
                    type="text"
                    placeholder="Search by ID or Name"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="border rounded p-2 w-64"
                />
            </div>

            {/* Transactions Table */}
            <Card
                title='Wallet Summary'
            >
                <Table
                    headers={['Wallet ID', 'Student Name', 'Date', 'Amount']}
                    data={transactionmap}
                />
            </Card>

        </div>
    )
}

export default Wallet
