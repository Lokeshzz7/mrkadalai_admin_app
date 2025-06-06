import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Marquee from 'react-fast-marquee';
import Button from '../components/ui/Button';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [inventoryTab, setInventoryTab] = useState('food');
  const navigate = useNavigate();

  // ! Fake Data for recent orders (should be replaced with API)

  const recentOrderIds = ['#12345', '#12346', '#12347', '#12348', '#12349', '#12350'];

  // ! Fake Data for orders (should be replaced with API)

  const orders = [
  {
    id: '#12345',
    customer: 'John Doe',
    date: '2025-06-05',
    time: '2:30 PM',
    items: [
      { name: 'Pizza', price: '₹300', description: 'Cheesy with toppings', qty: 1 },
      { name: 'Burger', price: '₹200', description: 'Grilled beef burger', qty: 1 },
    ],
    totalItems: 2,
  },
  {
    id: '#12346',
    customer: 'Jane Smith',
    date: '2025-06-05',
    time: '2:25 PM',
    items: [
      { name: 'Pasta', price: '₹250', description: 'Creamy Alfredo', qty: 1 },
    ],
    totalItems: 1,
  },
  {
    id: '#12346',
    customer: 'Jane Smith',
    date: '2025-06-05',
    time: '2:25 PM',
    items: [
      { name: 'Pasta', price: '₹250', description: 'Creamy Alfredo', qty: 1 },
    ],
    totalItems: 1,
  },
   {
    id: '#12345',
    customer: 'John Doe',
    date: '2025-06-05',
    time: '2:30 PM',
    items: [
      { name: 'Pizza', price: '₹300', description: 'Cheesy with toppings', qty: 1 },
      { name: 'Burger', price: '₹200', description: 'Grilled beef burger', qty: 1 },
    ],
    totalItems: 2,
  },
   {
    id: '#12345',
    customer: 'John Doe',
    date: '2025-06-05',
    time: '2:30 PM',
    items: [
      { name: 'Pizza', price: '₹300', description: 'Cheesy with toppings', qty: 1 },
      { name: 'Burger', price: '₹200', description: 'Grilled beef burger', qty: 1 },
    ],
    totalItems: 2,
  },
   {
    id: '#12345',
    customer: 'John Doe',
    date: '2025-06-05',
    time: '2:30 PM',
    items: [
      { name: 'Pizza', price: '₹300', description: 'Cheesy with toppings', qty: 1 },
      { name: 'Burger', price: '₹200', description: 'Grilled beef burger', qty: 1 },
    ],
    totalItems: 2,
  },
   {
    id: '#12345',
    customer: 'John Doe',
    date: '2025-06-05',
    time: '2:30 PM',
    items: [
      { name: 'Pizza', price: '₹300', description: 'Cheesy with toppings', qty: 1 },
      { name: 'Burger', price: '₹200', description: 'Grilled beef burger', qty: 1 },
    ],
    totalItems: 2,
  },
   {
    id: '#12345',
    customer: 'John Doe',
    date: '2025-06-05',
    time: '2:30 PM',
    items: [
      { name: 'Pizza', price: '₹300', description: 'Cheesy with toppings', qty: 1 },
      { name: 'Burger', price: '₹200', description: 'Grilled beef burger', qty: 1 },
    ],
    totalItems: 2,
  },

];


  return (
    <div className="space-y-6 p-6">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>

      {/* Marquee Section */}
      <div className="w-full bg-white rounded-lg shadow-inner border border-gray-300 overflow-hidden">
        <Marquee gradient={false} speed={50} pauseOnHover={true}>
          <div className="flex gap-6 px-4 py-2">
            <span className="text-sm text-gray-700">New order received from Table A1</span>
            <span className="text-sm text-gray-700">Inventory updated: Tomatoes low stock</span>
            <span className="text-sm text-gray-700">Order #12345 delivered successfully</span>
          </div>
        </Marquee>
      </div>

      {/* Tabs */}
      <div className="flex justify-end space-x-4">
        <Button
          variant={activeTab === 'orders' ? 'black' : 'secondary'}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </Button>
        <Button
          variant={activeTab === 'inventory' ? 'black' : 'secondary'}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory
        </Button>
      </div>

      {/* Orders Section */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Orders List Heading */}
          <h3 className="text-xl font-semibold text-gray-800">Orders List</h3>

          {/* Recent Order IDs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {recentOrderIds.map((orderId) => (
              <div
                key={orderId}
                className="bg-white border border-gray-300 rounded-lg p-4 text-center shadow"
              >
                <span className="text-sm font-medium text-gray-700">{orderId}</span>
              </div>
            ))}
          </div>

          {/* Orders Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto scrollbar-hide">
            {orders.map((order) => (
                <div
                key={order.id}
                className="bg-white border border-gray-300 rounded-lg p-4 shadow space-y-3"
                >
                {/* Header Line: ID and Customer */}
                <div>
                    <h4 className="text-md font-bold text-gray-800">
                    {order.id} from {order.customer}
                    </h4>
                    <p className="text-xs text-gray-500">{order.date} at {order.time}</p>
                </div>

                {/* Items */}
                <div className="space-y-2">
                    {order.items.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-2">
                        <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        <span className="text-sm font-semibold text-gray-800">{item.price}</span>
                        </div>
                        <p className="text-xs text-gray-500">{item.description}</p>
                        <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                    </div>
                    ))}
                </div>

                {/* Divider */}
                <hr className="border-t border-gray-300" />

                {/* Footer */}
                <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-gray-700 font-medium">
                    Total Items: {order.totalItems}
                    </span>
                    <div className="flex space-x-2">
                    <Button size="sm" variant="success">✓</Button>
                    <Button size="sm" variant="danger">✕</Button>
                    </div>
                </div>
                </div>
            ))}
            </div>

        </div>
      )}

      {/* Inventory Section */}
      {activeTab === 'inventory' && (
  <div className="space-y-6">
    {/* Inventory Heading */}
    <h3 className="text-xl font-semibold text-gray-800">Inventory</h3>

    {/* Inventory Sub-tabs */}
    <div className="flex space-x-4">
      <Button
        variant={inventoryTab === 'food' ? 'black' : 'secondary'}
        onClick={() => setInventoryTab('food')}
      >
        Food Items
      </Button>
      <Button
        variant={inventoryTab === 'ingredients' ? 'black' : 'secondary'}
        onClick={() => setInventoryTab('ingredients')}
      >
        Ingredients
      </Button>
      <Button
        variant={inventoryTab === 'disposals' ? 'black' : 'secondary'}
        onClick={() => setInventoryTab('disposals')}
      >
        Disposals
      </Button>
    </div>

    {/* Inventory Cards - Scrollable */}
    <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-hide scrollbar-track-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(
                inventoryTab === 'food'
                    ? [
                        { level: 'Low Stock', updated: '10 mins ago', item: 'Tomatoes', stock: 1, status: 'Urgent' },
                        { level: 'Medium Stock', updated: '45 mins ago', item: 'Cheese', stock: 2, status: 'Warning' },
                        { level: 'High Stock', updated: '1 hr ago', item: 'Bread', stock: 4, status: 'Normal' },
                        { level: 'Low Stock', updated: '5 mins ago', item: 'Oil', stock: 1, status: 'Critical' },
                        { level: 'Low Stock', updated: '10 mins ago', item: 'Tomatoes', stock: 1, status: 'Urgent' },
                        { level: 'Medium Stock', updated: '45 mins ago', item: 'Cheese', stock: 2, status: 'Warning' },
                        { level: 'High Stock', updated: '1 hr ago', item: 'Bread', stock: 4, status: 'Normal' },
                        { level: 'Low Stock', updated: '5 mins ago', item: 'Oil', stock: 1, status: 'Critical' },
                        { level: 'Low Stock', updated: '10 mins ago', item: 'Tomatoes', stock: 1, status: 'Urgent' },
                        { level: 'Medium Stock', updated: '45 mins ago', item: 'Cheese', stock: 2, status: 'Warning' },
                        { level: 'High Stock', updated: '1 hr ago', item: 'Bread', stock: 4, status: 'Normal' },
                        { level: 'Low Stock', updated: '5 mins ago', item: 'Oil', stock: 1, status: 'Critical' },
                    ]
                    : inventoryTab === 'ingredients'
                    ? [
                        { level: 'Low Stock', updated: '15 mins ago', item: 'Salt', stock: 1, status: 'Low' },
                        { level: 'High Stock', updated: '20 mins ago', item: 'Pepper', stock: 3, status: 'Stable' },
                        { level: 'Medium Stock', updated: '30 mins ago', item: 'Oregano', stock: 2, status: 'Moderate' },
                    ]
                    : [
                        { level: 'Disposal Needed', updated: '2 hrs ago', item: 'Expired Milk', stock: 0, status: 'Remove' },
                        { level: 'Disposal Pending', updated: '1 hr ago', item: 'Old Cheese', stock: 0, status: 'Dispose' },
                    ]
                ).map((inv, idx) => (
                <div
                    key={idx}
                    className="bg-white border border-gray-300 rounded-lg p-4 shadow space-y-3"
                >
                    <div className="text-sm font-semibold text-gray-800">
                    {inv.level}{' '}
                    <span className="text-xs text-gray-500">— updated {inv.updated}</span>
                    </div>
                    <div className="text-sm text-gray-700">
                    Item: <span className="font-medium">{inv.item}</span>
                    </div>
                    <div className="text-sm text-gray-700">
                    Stock Level: <span className="font-medium">{inv.stock}</span>
                    </div>
                    <div className="text-sm text-gray-700">
                    Status:{' '}
                    <span className="font-semibold text-red-600">{inv.status}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                    <Button size="sm" variant="primary">Restock</Button>
                    <span className="text-sm text-blue-600 underline cursor-pointer" onClick={() => navigate('/inventory')}>View Inventory</span>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
        )}


    </div>
  );
};

export default Notifications;
