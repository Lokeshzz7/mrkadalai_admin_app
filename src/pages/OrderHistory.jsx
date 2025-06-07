import React, { useState } from 'react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import dayjs from 'dayjs'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'

const OrderHistory = () => {

    const [searchQuery, setSearchQuery] = useState('');

    const orders = [
        {
            orderId: 'ORD001',
            name: 'John Doe',
            orderItems: 'Burger, Fries',
            status: 'delivered',
            price: '$12.99',
            timeStamp: '2025-06-04 14:32',
            actions: 'View',
        },
        {
            orderId: 'ORD002',
            name: 'Jane Smith',
            orderItems: 'Pizza',
            status: 'preparing',
            price: '$8.50',
            timeStamp: '2025-06-04 15:10',
            actions: 'View',
        },
        {
            orderId: 'ORD003',
            name: 'Michael Lee',
            orderItems: 'Salad, Juice',
            status: 'cancelled',
            price: '$10.20',
            timeStamp: '2025-06-03 18:45',
            actions: 'View',
        },
        {
            orderId: 'ORD004',
            name: 'Alice Brown',
            orderItems: 'Pasta',
            status: 'delivered',
            price: '$9.99',
            timeStamp: '2025-06-04 13:00',
            actions: 'View',
        },
        {
            orderId: 'ORD005',
            name: 'David Wilson',
            orderItems: 'Sushi',
            status: 'preparing',
            price: '$15.60',
            timeStamp: '2025-06-04 16:20',
            actions: 'View',
        },
    ];

    const filteredorders = orders.filter(ord => ord.orderId.toLowerCase().includes(searchQuery.toLowerCase()) || ord.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const searchedOrders = filteredorders.map(ord => [
        ord.orderId,
        ord.name,
        ord.orderItems,
        <Badge
            variant={ord.status}
        >
            {ord.status}
        </Badge>,
        ord.price,
        ord.timeStamp,
        <Button>
            View
        </Button>

    ])

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold">Order Management</h1>

            <div className='flex justify-end items-center'>
                <input
                    type='text'
                    placeholder='Search by ID and Name'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='border rounded p-2'
                />
            </div>

            <Card
                title='Order Management'
            >
                <Table
                    headers={['Order Id', 'Name', 'Order Items', 'Status', 'Price', 'Time Stamp', 'Actions']}
                    data={searchedOrders}
                />
            </Card>
        </div>
    )
}

export default OrderHistory
