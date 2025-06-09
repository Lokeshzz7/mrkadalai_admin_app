import React, { useState } from 'react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'

const OrderHistory = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const orders = [
        {
            orderId: 'ORD001',
            name: 'John Doe',
            phone: '9876543210',
            status: 'delivered',
            orderType: 'app',
            orderItems: [
                { item: 'Burger', quantity: 2, unitPrice: 5.99 },
                { item: 'Fries', quantity: 1, unitPrice: 1.99 }
            ],
            timeStamp: '2025-06-04 14:32'
        },
        {
            orderId: 'ORD002',
            name: 'Jane Smith',
            phone: '9123456789',
            status: 'preparing',
            orderType: 'manual',
            orderItems: [
                { item: 'Pizza', quantity: 1, unitPrice: 8.5 }
            ],
            timeStamp: '2025-06-04 15:10'
        },
        {
            orderId: 'ORD003',
            name: 'Michael Lee',
            phone: '9988776655',
            status: 'cancelled',
            orderType: 'manual',
            orderItems: [
                { item: 'Salad', quantity: 1, unitPrice: 4.5 },
                { item: 'Juice', quantity: 2, unitPrice: 2.85 }
            ],
            timeStamp: '2025-06-03 18:45'
        },
        {
            orderId: 'ORD004',
            name: 'Alice Brown',
            phone: '9012345678',
            status: 'delivered',
            orderType: 'app',
            orderItems: [
                { item: 'Pasta', quantity: 1, unitPrice: 9.99 }
            ],
            timeStamp: '2025-06-04 13:00'
        },
        {
            orderId: 'ORD005',
            name: 'David Wilson',
            phone: '9870012345',
            status: 'preparing',
            orderType: 'manual',
            orderItems: [
                { item: 'Sushi', quantity: 2, unitPrice: 7.80 }
            ],
            timeStamp: '2025-06-04 16:20'
        }
    ];

    const filteredOrders = orders.filter(ord =>
        (ord.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ord.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (statusFilter === '' || ord.status === statusFilter)
    );

    const openModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setShowModal(false);
    };

    const searchedOrders = filteredOrders.map(ord => [
        ord.orderId,
        ord.name,
        ord.orderItems.map(i => i.item).join(', '),
        <Badge variant={ord.status}>{ord.status}</Badge>,
        `$${ord.orderItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0).toFixed(2)}`,
        ord.orderType === 'manual'
            ? <Badge variant="info">Manual</Badge>
            : <Badge variant="success">App</Badge>,
        ord.timeStamp,
        <Button onClick={() => openModal(ord)}>View</Button>
    ]);

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold">Order Management</h1>

            <div className='flex justify-end items-center space-x-4'>
                <select
                    className='border rounded p-2'
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value=''>All</option>
                    <option value='preparing'>Preparing</option>
                    <option value='delivered'>Delivered</option>
                    <option value='cancelled'>Cancelled</option>
                </select>
                <input
                    type='text'
                    placeholder='Search by ID or Name'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='border rounded p-2'
                />
            </div>

            <Card title='Order Management'>
                <Table
                    headers={['Order Id', 'Name', 'Order Items', 'Status', 'Price', 'Order Type', 'Time Stamp', 'Actions']}
                    data={searchedOrders}
                />
            </Card>

            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={`Order Details: ${selectedOrder?.orderId}`}
                footer={
                    <Button variant="black" onClick={closeModal}>Close</Button>
                }
            >
                {selectedOrder && (
                    <div className="space-y-4">
                        <div>
                            <p><strong>Customer Name:</strong> {selectedOrder.name}</p>
                            <p><strong>Phone Number:</strong> {selectedOrder.phone}</p>
                            <p><strong>Status:</strong> <Badge variant={selectedOrder.status}>{selectedOrder.status}</Badge></p>
                            <p><strong>Order Type:</strong> {selectedOrder.orderType === 'manual'
                                ? <Badge variant="info">Manual</Badge>
                                : <Badge variant="success">App</Badge>}
                            </p>
                        </div>

                        <table className="w-full border border-gray-300 text-sm mt-4">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 border">Item</th>
                                    <th className="p-2 border">Quantity</th>
                                    <th className="p-2 border">Unit Price</th>
                                    <th className="p-2 border">Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.orderItems.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="p-2 border">{item.item}</td>
                                        <td className="p-2 border">{item.quantity}</td>
                                        <td className="p-2 border">${item.unitPrice.toFixed(2)}</td>
                                        <td className="p-2 border">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr className="font-semibold bg-gray-50">
                                    <td colSpan="3" className="p-2 border text-right">Grand Total</td>
                                    <td className="p-2 border">
                                        ${selectedOrder.orderItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0).toFixed(2)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default OrderHistory;
