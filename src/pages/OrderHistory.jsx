import React, { useState, useEffect } from 'react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import { apiRequest } from '../utils/api'
import Loader from '../components/ui/Loader'

const OrderHistory = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const outletId = localStorage.getItem('outletId');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiRequest(`/superadmin/outlets/${outletId}/orders/`);

            console.log(response);

            const transformedOrders = response.map(order => ({
                orderId: `#${order.orderId.toString().padStart(3, '0')}`,
                name: order.customerName,
                phone: order.customerPhone,
                status: order.status.toLowerCase(),
                orderType: order.type,
                orderItems: order.items.map(item => ({
                    item: item.productName,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                })),
                timeStamp: new Date(order.orderTime).toLocaleDateString('en-CA') + ' ' +
                    new Date(order.orderTime).toLocaleTimeString('en-US', {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                totalAmount: order.totalAmount,
                paymentMethod: order.paymentMethod
            }));

            setOrders(transformedOrders);
        } catch (err) {
            setError(err.message);
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
        }
    };

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

    // Status mapping for badge variants
    const getStatusVariant = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
            case 'completed':
                return 'success';
            case 'preparing':
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'danger';
            default:
                return 'info';
        }
    };

    const searchedOrders = filteredOrders.map(ord => [
        ord.orderId,
        ord.name,
        ord.orderItems.length > 2
            ? `${ord.orderItems.slice(0, 2).map(i => i.item).join(', ')}, +${ord.orderItems.length - 2}`
            : ord.orderItems.map(i => i.item).join(', '),
        <Badge variant={getStatusVariant(ord.status)}>{ord.status}</Badge>,
        `₹${ord.orderItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0).toFixed(2)}`,
        ord.orderType === 'MANUAL'
            ? <Badge variant="info">Manual</Badge>
            : <Badge variant="success">App</Badge>,
        ord.timeStamp,
        <Button onClick={() => openModal(ord)}>View</Button>
    ]);

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-4xl font-bold">Order Management</h1>
                <Card title='Order Management'>
                    <div className="flex p-8 justify-center items-center">
                        <Loader />
                    </div>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-4xl font-bold">Order Management</h1>
                <Card title='Order Management'>
                    <div className="p-8 text-center text-red-600">
                        <p>Error loading orders: {error}</p>
                        <Button onClick={fetchOrders} className="mt-4">Retry</Button>
                    </div>
                </Card>
            </div>
        );
    }

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
                    <option value='pending'>Pending</option>
                    <option value='delivered'>Delivered</option>
                    <option value='completed'>Completed</option>
                    <option value='cancelled'>Cancelled</option>
                </select>
                <input
                    type='text'
                    placeholder='Search by ID or Name'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='border rounded p-2'
                />
                <Button onClick={fetchOrders}>Refresh</Button>
            </div>

            <div className='pb-5'>
                <Card title='Order Management'>
                    <Table
                        headers={['Order Id', 'Name', 'Order Items', 'Status', 'Price', 'Order Type', 'Time Stamp', 'Actions']}
                        data={searchedOrders}
                    />
                </Card>
            </div>

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
                            <p><strong>Status:</strong> <Badge variant={getStatusVariant(selectedOrder.status)}>{selectedOrder.status}</Badge></p>
                            <p><strong>Order Type:</strong> {selectedOrder.orderType === 'MANUAL'
                                ? <Badge variant="info">Manual</Badge>
                                : <Badge variant="success">App</Badge>}
                            </p>
                            {selectedOrder.paymentMethod && (
                                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                            )}
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
                                        <td className="p-2 border">₹{item.unitPrice.toFixed(2)}</td>
                                        <td className="p-2 border">₹{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr className="font-semibold bg-gray-50">
                                    <td colSpan="3" className="p-2 border text-right">Grand Total</td>
                                    <td className="p-2 border">
                                        ₹{selectedOrder.orderItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0).toFixed(2)}
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

