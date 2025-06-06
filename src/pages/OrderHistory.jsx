import React, { useState } from 'react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import dayjs from 'dayjs'

const OrderHistory = () => {
    const today = dayjs().startOf('day')
    const [selectedDate, setSelectedDate] = useState(today)

    const previousDate = today.subtract(1, 'day')
    const nextDate = today.add(1, 'day')

    // Sample order data (replace with API later)
    const orders = [
        {
            id: 'ORD001',
            date: today.format('YYYY-MM-DD'),
            customer: 'John Doe',
            type: 'Dine-In',
            time: '12:30 PM',
            items: '2x Biryani, 1x Coke',
            status: 'Delivered'
        },
        {
            id: 'ORD002',
            date: previousDate.format('YYYY-MM-DD'),
            customer: 'Alice',
            type: 'Takeaway',
            time: '1:15 PM',
            items: '1x Butter Chicken',
            status: 'Cancelled'
        },
        {
            id: 'ORD003',
            date: nextDate.format('YYYY-MM-DD'),
            customer: 'Bob',
            type: 'Delivery',
            time: '7:45 PM',
            items: '3x Ice Cream',
            status: 'Scheduled'
        }
    ]

    const filteredOrders = orders.filter(order => order.date === selectedDate.format('YYYY-MM-DD'))

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Order History</h1>

            <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex gap-2">
                    <Button
                        variant={selectedDate.isSame(previousDate, 'day') ? 'black' : 'secondary'}
                        onClick={() => setSelectedDate(previousDate)}
                    >
                        {previousDate.format('DD MMM')}
                    </Button>
                    <Button
                        variant={selectedDate.isSame(today, 'day') ? 'black' : 'secondary'}
                        onClick={() => setSelectedDate(today)}
                    >
                        {today.format('DD MMM')}
                    </Button>
                    <Button
                        variant={selectedDate.isSame(nextDate, 'day') ? 'black' : 'secondary'}
                        onClick={() => setSelectedDate(nextDate)}
                    >
                        {nextDate.format('DD MMM')}
                    </Button>
                </div>

                {selectedDate.isSame(today, 'day') && (
                    <Button className="bg-theme">Add Order</Button>
                )}
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">Order ID</th>
                                <th className="p-2 border">Customer</th>
                                <th className="p-2 border">Type</th>
                                <th className="p-2 border">Time</th>
                                <th className="p-2 border">Items</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center text-gray-500 p-4">No orders found for this date.</td>
                                </tr>
                            ) : (
                                filteredOrders.map(order => (
                                    <tr key={order.id}>
                                        <td className="p-2 border">{order.id}</td>
                                        <td className="p-2 border">{order.customer}</td>
                                        <td className="p-2 border">{order.type}</td>
                                        <td className="p-2 border">{order.time}</td>
                                        <td className="p-2 border">{order.items}</td>
                                        <td className="p-2 border">
                                            <span className={`px-2 py-1 rounded text-xs font-medium
                                                ${order.status === 'Delivered' && 'bg-green-100 text-green-700'}
                                                ${order.status === 'Cancelled' && 'bg-red-100 text-red-700'}
                                                ${order.status === 'Scheduled' && 'bg-yellow-100 text-yellow-700'}
                                            `}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-2 border">
                                            {/* You can put action buttons or links here */}
                                            <Button size="xs" variant="secondary">Details</Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}

export default OrderHistory
