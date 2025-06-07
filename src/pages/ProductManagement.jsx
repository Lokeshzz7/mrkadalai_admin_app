import React, { useState } from 'react';
import food from '../assets/food.jpg'; // adjust path as needed
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const categories = ['All', 'Food', 'Beverages', 'Drinks', 'Others'];

const dummyProducts = [
    { id: 1, name: 'Burger', image: food, category: 'Food', price: '$5' },
    { id: 2, name: 'Pizza', image: food, category: 'Food', price: '$8' },
    { id: 3, name: 'Coke', image: food, category: 'Drinks', price: '$2' },
    { id: 4, name: 'Orange Juice', image: food, category: 'Beverages', price: '$3' },
    { id: 5, name: 'French Fries', image: food, category: 'Others', price: '$4' },
];

const ProductManagement = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredProducts =
        selectedCategory === 'All'
            ? dummyProducts
            : dummyProducts.filter(product => product.category === selectedCategory);

    return (
        <div className="space-y-6 p-4">
            <h1 className="text-4xl font-bold">Product Management</h1>

            {/* Filter & Action Buttons */}
            <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                    <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border rounded-md"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="flex space-x-2">
                    <Button variant='success' >Add Product</Button>
                    <Button variant='danger' >Remove Product</Button>
                </div>
            </div>

            {/* Table */}
            <Card
                title='All Products'
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-9">

                    {filteredProducts.map((product) => (
                        <div key={product.id} >
                            <Card
                                title={product.name}
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                />
                                <div className='flex flex-row justify-between items-center mt-3 text-xl font-semibold'>
                                    <p>{product.category}</p>
                                    <p>{product.price}</p>

                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </Card>



        </div >
    );
};

export default ProductManagement;
