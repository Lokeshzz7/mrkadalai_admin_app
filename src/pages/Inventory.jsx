import React, { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'

const Inventory = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const inventoryData = [
        {
            productName: 'Burger Buns',
            category: 'Food',
            quantity: 120,
            threshold: 50,
            lastRestocked: '2025-06-01',
            status: 'sufficient',
            action: 'View',
        },
        {
            productName: 'Tomato Ketchup',
            category: 'Beverages',
            quantity: 20,
            threshold: 30,
            lastRestocked: '2025-05-29',
            status: 'lowStock',
            action: 'View',
        },
        {
            productName: 'Cheese Slices',
            category: 'Food',
            quantity: 45,
            threshold: 40,
            lastRestocked: '2025-06-03',
            status: 'threshold',
            action: 'View',
        },
        {
            productName: 'French Fries',
            category: 'Food',
            quantity: 10,
            threshold: 25,
            lastRestocked: '2025-05-20',
            status: 'lowStock',
            action: 'View',
        },
        {
            productName: 'Soft Drinks',
            category: 'Drinks',
            quantity: 90,
            threshold: 50,
            lastRestocked: '2025-06-02',
            status: 'sufficient',
            action: 'View',
        },
        {
            productName: 'Disposable Cups',
            category: 'Others',
            quantity: 30,
            threshold: 30,
            lastRestocked: '2025-05-28',
            status: 'threshold',
            action: 'View',
        },
    ];

    const filteredInventory = inventoryData.filter(inv =>
        inv.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.category.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const searchedInventoryData = filteredInventory.map(inv => ([
        inv.productName,
        inv.category,
        inv.quantity,
        inv.threshold,
        inv.lastRestocked,
        <Badge variant={inv.status}>
            {inv.status}
        </Badge>,
        <Button>
            View
        </Button>
    ]))

    return (
        <div className="space-y-6">

            <h1 className='text-4xl font-bold'>Inventory Management</h1>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>

                <Card Black className="text-center">
                    <p className="text-gray-600">Inventory Items</p>
                    <h2 className="text-2xl font-bold text-orange-600">23</h2>

                </Card>
                <Card Black className="text-center">
                    <p className="text-gray-600">Low Stock Items</p>
                    <h2 className="text-2xl font-bold text-orange-600">23</h2>

                </Card>
                <Card Black className="text-center">
                    <p className="text-gray-600">Disposed Items</p>
                    <h2 className="text-2xl font-bold text-orange-600">23</h2>

                </Card>
                <Card Black className="text-center">
                    <p className="text-gray-600">Restocked Items</p>
                    <h2 className="text-2xl font-bold text-orange-600">23</h2>

                </Card>


            </div>
            <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                    <input
                        type='text'
                        placeholder='Search by name and category'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='border rounded p-2'
                    />
                </div>

                <div className="flex space-x-2">
                    <Button variant='success' >Add Product</Button>
                    <Button variant='danger' >Remove Product</Button>
                </div>
            </div>

            <div>
                <Card
                    title='Inventory Details'
                >
                    <Table
                        headers={['Product name', 'Category', 'Quantity', 'Threshold', 'Last Restocked', 'Status', 'Action']}
                        data={searchedInventoryData}

                    />
                </Card>
            </div>
        </div>


    )
}

export default Inventory
