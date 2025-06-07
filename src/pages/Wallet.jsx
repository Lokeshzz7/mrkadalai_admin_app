import React, { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'

const Wallet = () => {
    const [showRechargeModal, setShowRechargeModal] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [activeTab, setActiveTab] = useState('summary');

    // Sample Transaction Data (replace with API call later)
    const transactionData = [
        {
            id: '#TXN001',
            name: 'John Doe',
            date: '2025-06-01',
            amount: '₹500',
            walletBalance: '₹1500',
            totalRecharged: '₹2000',
            totalUsed: '₹500',
            lastRecharge: '2025-06-01',
            lastOrder: '2025-06-03',
            paymentMethod: 'UPI',
            status: 'success',
            orderId: '#ORD001',
            orderStatus: 'success'
        },
        {
            id: '#TXN002',
            name: 'Jane Smith',
            date: '2025-06-01',
            amount: '₹300',
            walletBalance: '₹1000',
            totalRecharged: '₹1300',
            totalUsed: '₹300',
            lastRecharge: '2025-06-01',
            lastOrder: '2025-06-02',
            paymentMethod: 'Card',
            status: 'success',
            orderId: '#ORD002',
            orderStatus: 'success'
        },
        {
            id: '#TXN003',
            name: 'Mike Johnson',
            date: '2025-06-01',
            amount: '₹250',
            walletBalance: '₹750',
            totalRecharged: '₹1000',
            totalUsed: '₹250',
            lastRecharge: '2025-06-01',
            lastOrder: '2025-06-04',
            paymentMethod: 'Netbanking',
            status: 'pending',
            orderId: '#ORD003',
            orderStatus: 'pending'
        }
    ]


    // Filtered data based on search input
    const filteredTransactions = transactionData.filter(txn =>
        txn.id.toLowerCase().includes(searchText.toLowerCase()) ||
        txn.name.toLowerCase().includes(searchText.toLowerCase())
    )

    const transactionSummaryMap = filteredTransactions.map(txn => [
        txn.id,
        txn.name,
        txn.walletBalance,
        txn.totalRecharged,
        txn.totalUsed,
        txn.lastRecharge,
        txn.lastOrder
    ])

    const rechargeHistoryMap = filteredTransactions.map(txn => [
        txn.id,
        txn.name,
        txn.amount,
        txn.date,
        txn.paymentMethod,
        // txn.status,
        <Badge
            variant={txn.status}
        >
            {txn.status}
        </Badge>
    ])

    const paidOrdersMap = filteredTransactions.map(txn => [
        txn.orderId,
        txn.name,
        txn.amount,
        txn.date,
        <Badge
            variant={txn.orderStatus}
        >
            {txn.orderStatus === 'success' ? 'Delivered' : 'processing'}
        </Badge>

    ])

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold">Wallet Recharge</h1>

            <div className='flex justify-between items-center'>
                <div className='flex space-x-4'>
                    <Button
                        variant={activeTab === 'summary' ? 'black' : 'secondary'}
                        onClick={() => setActiveTab('summary')}
                    >
                        Wallet Summary
                    </Button>
                    <Button
                        variant={activeTab === 'history' ? 'black' : 'secondary'}
                        onClick={() => setActiveTab('history')}
                    >
                        Recharge History
                    </Button>
                    <Button
                        variant={activeTab === 'orders' ? 'black' : 'secondary'}
                        onClick={() => setActiveTab('orders')}
                    >
                        Paid orders
                    </Button>
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

            {activeTab === 'summary' && (
                <Card
                    title='Wallet Summary'
                >
                    <Table
                        headers={['Wallet ID', 'Customer Name', 'Wallet balance', 'Total Recharged', 'Total used', 'Last Recharge', 'last Order']}
                        data={transactionSummaryMap}
                    />
                </Card>
            )}

            {activeTab === 'history' && (
                <Card
                    title='Wallet History'
                >
                    <Table
                        headers={['Recharge Id ', 'Customer name ', 'Amount', 'Date', 'Payment Method', 'status']}
                        data={rechargeHistoryMap}
                    />

                </Card>
            )}

            {activeTab === 'orders' && (
                <Card
                    title='Paid Orders'
                >

                    <Table
                        headers={['Order Id', 'Customer name', 'Amount', 'Date', 'Order Status']}
                        data={paidOrdersMap}
                    />

                </Card>
            )}
        </div>
    )
}

export default Wallet
