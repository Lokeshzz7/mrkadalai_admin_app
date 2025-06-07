import React, { useState } from 'react'
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';

const Expenditure = () => {
    const [activeTab, setActiveTab] = useState('tracker');
    const [searchQuery, setSearchQuery] = useState('');

    const allExpense = [
        { category: 'Food', description: 'Lunch at restaurant', amount: '₹500', date: '2025-06-01', paymentMethod: 'Cash' },
        { category: 'Transport', description: 'Uber ride to office', amount: '₹250', date: '2025-06-01', paymentMethod: 'UPI' },
        { category: 'Utilities', description: 'Electricity bill', amount: '₹1200', date: '2025-06-02', paymentMethod: 'Credit Card' },
        { category: 'Shopping', description: 'T-shirt purchase', amount: '₹800', date: '2025-06-03', paymentMethod: 'Debit Card' },
        { category: 'Food', description: 'Groceries', amount: '₹1500', date: '2025-06-04', paymentMethod: 'UPI' },
        { category: 'Entertainment', description: 'Movie night', amount: '₹300', date: '2025-06-04', paymentMethod: 'Cash' },
        { category: 'Transport', description: 'Bus pass renewal', amount: '₹600', date: '2025-06-05', paymentMethod: 'UPI' },
        { category: 'Health', description: 'Medical checkup', amount: '₹2000', date: '2025-06-05', paymentMethod: 'Credit Card' },
        { category: 'Utilities', description: 'Internet bill', amount: '₹999', date: '2025-06-06', paymentMethod: 'UPI' },
        { category: 'Food', description: 'Dinner delivery', amount: '₹700', date: '2025-06-06', paymentMethod: 'Cash' }
    ];

    const filteredExpense = allExpense.filter(expense =>
        expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const expensehistory = filteredExpense.map(expense => ([
        expense.category,
        expense.description,
        expense.amount,
        expense.date,
        expense.paymentMethod
    ]));

    const [formData, setFormData] = useState({
        date: '',
        type: '',
        description: '',
        amount: '',
        paymentMethod: '',
        paidTo: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Expense Added");
        console.log(formData);
    };

    const handleReset = () => {
        setFormData({
            date: '',
            type: '',
            description: '',
            amount: '',
            paymentMethod: '',
            paidTo: ''
        });
    };

    return (
        <div className='space-y-6'>
            <h1 className='font-bold text-4xl'>
                Expenditure Management
            </h1>

            <div className='flex justify-between items-center'>
                <div className='flex space-x-4'>
                    <Button
                        variant={activeTab === 'tracker' ? 'black' : 'secondary'}
                        onClick={() => setActiveTab('tracker')}
                    >
                        Expense Tracker
                    </Button>

                    <Button
                        variant={activeTab === 'add' ? 'black' : 'secondary'}
                        onClick={() => setActiveTab('add')}
                    >
                        Add expense
                    </Button>
                </div>
            </div>

            {activeTab === 'tracker' && (
                <div className='space-y-6'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
                        <Card Black className='text-center'>
                            <p className="text-gray-600">Total revenue</p>
                            <h2 className="text-2xl font-bold text-blue-600">450000</h2>
                        </Card>
                        <Card Black className='text-center'>
                            <p className="text-gray-600">Total expenses</p>
                            <h2 className="text-2xl font-bold text-blue-600">12000</h2>
                        </Card>
                        <Card Black className='text-center'>
                            <p className="text-gray-600">Net profit</p>
                            <h2 className="text-2xl font-bold text-blue-600">438000</h2>
                        </Card>
                        <Card Black className='text-center'>
                            <p className="text-gray-600">Total orders</p>
                            <h2 className="text-2xl font-bold text-blue-600">45</h2>
                        </Card>
                    </div>

                    <div className="flex justify-end">
                        <input
                            type='text'
                            placeholder='Search by category, description, or payment method'
                            className='border px-3 py-2 rounded w-full max-w-md'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div>
                        <Card Black title='Expense Tracker'>
                            <Table
                                headers={['Category', 'Description', 'Amount', 'Date', 'Payment Method']}
                                data={expensehistory}
                            />
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === 'add' && (
                <Card title="Add New Expense">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Row 1: Date and Expenditure Type */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expenditure Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Select Type</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Staff Salary">Staff Salary</option>
                                    <option value="Miscellaneous">Miscellaneous</option>
                                </select>
                            </div>
                        </div>

                        {/* Row 2: Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expense Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                rows="2"
                                placeholder="Enter description"
                            />
                        </div>

                        {/* Row 3: Amount, Payment Method, Paid To */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Select Method</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Card">Card</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Paid To</label>
                                <input
                                    type="text"
                                    name="paidTo"
                                    value={formData.paidTo}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Enter recipient"
                                />
                            </div>
                        </div>

                        {/* Row 4: Buttons (Right-aligned) */}
                        <div className="flex justify-end space-x-2 pt-2">
                            <Button type="button" variant="danger" onClick={handleReset}>Reset</Button>
                            <Button type="submit" variant="success">Add Expense</Button>
                        </div>
                    </form>
                </Card>
            )}


        </div>
    )
}

export default Expenditure;
