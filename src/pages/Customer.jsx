import React, { useState } from 'react'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import Button from '../components/ui/Button'

const Customer = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const customersData = [
        {
            customerId: 'CUST001',
            walletId: 'WALLET001',
            name: 'Alice Johnson',
            year: '2022',
            phoneNumber: '9876543210',
            walletBalance: '₹12,500',
            totalPurchase: '₹45,000',
            action: <Button>View</Button>
        },
        {
            customerId: 'CUST002',
            walletId: 'WALLET002',
            name: 'Bob Smith',
            year: '2023',
            phoneNumber: '9123456780',
            walletBalance: '₹5,750',
            totalPurchase: '₹22,300',
            action: <Button>View</Button>
        },
        {
            customerId: 'CUST003',
            walletId: 'WALLET003',
            name: 'Charlie Davis',
            year: '2021',
            phoneNumber: '9001234567',
            walletBalance: '₹8,000',
            totalPurchase: '₹31,100',
            action: <Button>View</Button>
        },
        {
            customerId: 'CUST004',
            walletId: 'WALLET004',
            name: 'Diana Miller',
            year: '2024',
            phoneNumber: '9898989898',
            walletBalance: '₹3,200',
            totalPurchase: '₹14,800',
            action: <Button>View</Button>
        },
        {
            customerId: 'CUST005',
            walletId: 'WALLET005',
            name: 'Ethan Brown',
            year: '2023',
            phoneNumber: '9870011223',
            walletBalance: '₹15,900',
            totalPurchase: '₹60,000',
            action: <Button>View</Button>
        }
    ]

    const filteredCustomers = customersData.filter(customer => customer.customerId.toLowerCase().includes(searchQuery.toLowerCase()) || customer.walletId.toLowerCase().includes(searchQuery.toLowerCase()) || customer.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const tableData = filteredCustomers.map(c => [
        c.customerId,
        c.walletId,
        c.name,
        c.year,
        c.phoneNumber,
        c.walletBalance,
        c.totalPurchase,
        c.action
    ])


    return (
        <div className='space-y-6'>
            <h1 className='text-4xl font-bold'>
                Customers Management
            </h1>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
                <Card Black>
                    <p className="text-gray-600">Total customers</p>
                    <h2 className="text-2xl font-bold text-blue-600">45</h2>
                </Card>
                <Card Black>
                    <p className="text-gray-600">Active userss</p>
                    <h2 className="text-2xl font-bold text-blue-600">45</h2>
                </Card>
                <Card Black>
                    <p className="text-gray-600">High value customers</p>
                    <h2 className="text-2xl font-bold text-blue-600">45</h2>
                </Card>
                <Card Black>
                    <p className="text-gray-600">new customers</p>
                    <h2 className="text-2xl font-bold text-blue-600">45</h2>
                </Card>

            </div>

            <div className='flex justify-end items-center'>
                <input
                    type='text'
                    placeholder='Search by  ID or Name'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='border rounded p-2 w-64'
                />

            </div>
            <div>
                <Card
                    title='Customer details'
                >
                    <Table
                        headers={['Customer Id', 'Wallet Id', 'Name', 'Year', 'Phone Number', 'Wallet Balance', 'Total purchase', 'Actions']}

                        data={tableData}
                    />
                </Card>
            </div>
        </div>
    )
}

export default Customer