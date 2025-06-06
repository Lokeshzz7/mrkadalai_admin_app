import React, { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'

const Dashboard = () => {

    // ! Fake Data for low stock (should be replaced with API)
    const lowStockItems = [
        ['Tomatoes', '5 kg', '10 kg', <Badge variant="danger">Low</Badge>],
        ['Cheese', '2 kg', '8 kg', <Badge variant="danger">Critical</Badge>],
        ['Bread', '15 units', '20 units', <Badge variant="warning">Low</Badge>]
    ]

    const [searchQuery, setSearchQuery] = useState('')

    // ! Fake Data for recent orders (should be replaced with API)

    const allOrders = [
        { id: '#12345', customer: 'John Doe', items: 'Pizza, Burger', time: '2:30 PM', status: 'pending' },
        { id: '#12346', customer: 'Jane Smith', items: 'Pasta, Salad', time: '2:25 PM', status: 'success' },
        { id: '#12347', customer: 'Mike Johnson', items: 'Sandwich', time: '2:20 PM', status: 'warning' },
        { id: '#12345', customer: 'John Doe', items: 'Pizza, Burger', time: '2:30 PM', status: 'pending' },
        { id: '#12346', customer: 'Jane Smith', items: 'Pasta, Salad', time: '2:25 PM', status: 'success' },
        { id: '#12347', customer: 'Mike Johnson', items: 'Sandwich', time: '2:20 PM', status: 'warning' }
    ]

    const filteredOrders = allOrders.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const recentOrders = filteredOrders.map(order => ([
        order.id,
        order.customer,
        order.items,
        order.time,
        <Badge variant={order.status}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Badge>
    ]))

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <Card Black className="text-center">
                    <p className="text-gray-600">Today's Sales</p>
                    <h2 className="text-2xl font-bold text-blue-600">45</h2>
                </Card>
                <Card Black className="text-center">
                    <p className="text-gray-600">Manual Orders</p>
                    <h2 className="text-2xl font-bold text-green-600">340</h2>
                </Card>
                <Card Black className="text-center">
                    <p className="text-gray-600">App Orders</p>
                    <h2 className="text-2xl font-bold text-orange-600">23</h2>
                </Card>
                <Card Black className="text-center">
                    <p className="text-gray-600">Wallet Recharges</p>
                    <h2 className="text-2xl font-bold text-yellow-600">12</h2>
                </Card>
                <Card Black className="text-center">
                    <p className="text-gray-600">Low Stock Items</p>
                    <h2 className="text-2xl font-bold text-red-600">3</h2>
                </Card>
                <Card Black className="text-center">
                    <p className="text-gray-600">Refund Requests</p>
                    <h2 className="text-2xl font-bold text-purple-600">64</h2>
                </Card>
                <Card Black className="text-center">
                    <p className="text-gray-600">Best Seller</p>
                    <h2 className="text-2xl font-bold text-pink-600">Biryani</h2>
                </Card>
                <Card Black className="text-center">
                    <p className="text-gray-600">Peak Order Time</p>
                    <h2 className="text-2xl font-bold text-cyan-600">11 am - 1 pm</h2>
                </Card>
            </div>

            {/* Recent Orders Table */}
            <div>
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Recent Orders</h2>
                        <input
                            type="text"
                            placeholder="Search by ID or Customer..."
                            className="border px-3 py-1 rounded"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Table
                        headers={['Order ID', 'Customer', 'Items', 'Time', 'Status']}
                        data={recentOrders}
                    />
                </Card>
            </div>
        </div>
    )
}

export default Dashboard
