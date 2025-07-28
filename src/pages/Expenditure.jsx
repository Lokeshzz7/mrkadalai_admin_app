import React, { useState, useEffect } from 'react'
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import { apiRequest } from '../utils/api'; // Adjust the path based on your file structure
import toast from 'react-hot-toast';

const Expenditure = () => {
    const [activeTab, setActiveTab] = useState('tracker');
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [allExpense, setAllExpense] = useState([]);
    const [loading, setLoading] = useState(false);

    const outletId = localStorage.getItem('outletId');

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const data = await apiRequest(`/superadmin/outlets/get-expenses/${outletId}/`);
            setAllExpense(data.expenses || []);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
        setLoading(false);
    };

    const fetchExpensesByDateRange = async () => {
        if (!startDate || !endDate) return;

        setLoading(true);
        try {
            const data = await apiRequest('/superadmin/outlets/get-expenses-bydate/', {
                method: 'GET',
                body: {
                    outletId: outletId,
                    from: startDate,
                    to: endDate
                }
            });
            setAllExpense(data.expenses || []);
        } catch (error) {
            console.error('Error fetching expenses by date range:', error);
        }
        setLoading(false);
    };

    // Fetch expenses when date range changes
    useEffect(() => {
        if (startDate && endDate) {
            fetchExpensesByDateRange();
        } else {
            fetchExpenses();
        }
    }, [startDate, endDate]);

    const filterByRange = (data) => {
        if (!startDate || !endDate) return data;
        return data.filter(item => {
            const itemDate = new Date(item.expenseDate).toISOString().split('T')[0];
            return itemDate >= startDate && itemDate <= endDate;
        });
    };

    const filteredExpense = filterByRange(allExpense).filter(expense =>
        expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.method.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const expensehistory = filteredExpense.map(expense => ([
        expense.category,
        expense.description,
        `₹${expense.amount}`,
        new Date(expense.expenseDate).toLocaleDateString('en-GB'),
        expense.method
    ]));

    const totalAmount = (filterByRange(allExpense)).reduce((acc, curr) => {
        return acc + curr.amount;
    }, 0);

    const formatDate = (dateStr) => {
        const options = { month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    };

    const [formData, setFormData] = useState({
        expenseDate: '',
        category: '',
        description: '',
        amount: '',
        method: '',
        paidTo: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await apiRequest('/superadmin/outlets/add-expenses/', {
                method: 'POST',
                body: {
                    outletId: outletId,
                    description: formData.description,
                    category: formData.category,
                    amount: parseFloat(formData.amount),
                    method: formData.method,
                    paidTo: formData.paidTo,
                    expenseDate: formData.expenseDate
                }
            });

            toast.success("Expense Added Successfully");
            handleReset();
            fetchExpenses(); // Refresh the expense list
        } catch (error) {
            console.error('Error adding expense:', error);
            toast.error(`Error: ${error.message}`);
        }
        setLoading(false);
    };

    const handleReset = () => {
        setFormData({
            expenseDate: '',
            category: '',
            description: '',
            amount: '',
            method: '',
            paidTo: ''
        });
    };

    return (
        <div className='space-y-6'>
            <h1 className='font-bold text-4xl'>
                Expenditure Management
            </h1>

            {/* Top Controls */}
            <div className='flex justify-between items-center flex-wrap gap-4'>
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
                        Add Expense
                    </Button>
                </div>

                {/* Date Range Filter - Only in Tracker View */}
                {activeTab === 'tracker' && (
                    <div className="flex items-center space-x-2 ml-auto">
                        {showDatePicker ? (
                            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded border border-gray-300">
                                <input
                                    type="date"
                                    value={startDate}
                                    max={endDate || undefined}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="text-sm border-none bg-transparent focus:outline-none"
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    min={startDate || undefined}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="text-sm border-none bg-transparent focus:outline-none"
                                />
                                <button
                                    onClick={() => {
                                        setStartDate('');
                                        setEndDate('');
                                        setShowDatePicker(false);
                                    }}
                                    className="text-gray-400 hover:text-red-500 text-sm"
                                    title="Clear"
                                >
                                    ❌
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowDatePicker(true)}
                                className="flex items-center space-x-1 border border-gray-400 px-3 py-2 rounded hover:bg-gray-100"
                                title="Filter by Date Range"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z" />
                                </svg>
                                <span className="text-sm text-gray-700">Select Date Range</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Tracker View */}
            {activeTab === 'tracker' && (
                <div className='space-y-6'>
                    {/* Summary Cards */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
                        <Card Black className='text-center'>
                            <p className="text-gray-600">Total revenue</p>
                            <h2 className="text-2xl font-bold text-blue-600">₹450000</h2>
                        </Card>
                        <Card Black className='text-center'>
                            <p className="text-gray-600">Total expenses</p>
                            <h2 className="text-2xl font-bold text-blue-600">₹{totalAmount}</h2>
                        </Card>
                        <Card Black className='text-center'>
                            <p className="text-gray-600">Net profit</p>
                            <h2 className="text-2xl font-bold text-blue-600">₹{450000 - totalAmount}</h2>
                        </Card>
                        <Card Black className='text-center'>
                            <p className="text-gray-600">Total orders</p>
                            <h2 className="text-2xl font-bold text-blue-600">45</h2>
                        </Card>
                    </div>

                    {/* Table */}
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">Expense Tracker</h2>
                            <input
                                type="text"
                                placeholder="Search by category, description, or payment method"
                                className="border border-black px-3 py-2 rounded w-full sm:w-80 mt-2 sm:mt-0"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Card Black>
                            {loading ? (
                                <div className="text-center py-4">Loading...</div>
                            ) : (
                                <Table
                                    headers={['Category', 'Description', 'Amount', 'Date', 'Payment Method']}
                                    data={expensehistory}
                                />
                            )}
                        </Card>
                    </div>
                </div>
            )}

            {/* Add Expense View */}
            {activeTab === 'add' && (
                <Card title="Add New Expense">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Date</label>
                                <input
                                    type="date"
                                    name="expenseDate"
                                    value={formData.expenseDate}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Food">Food</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Health">Health</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Staff Salary">Staff Salary</option>
                                    <option value="Miscellaneous">Miscellaneous</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Expense Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                rows="2"
                                placeholder="Enter description"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                                <select
                                    name="method"
                                    value={formData.method}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                >
                                    <option value="">Select Method</option>
                                    <option value="CASH">Cash</option>
                                    <option value="CARD">Card</option>
                                    <option value="UPI">UPI</option>
                                    <option value="WALLET">Wallet</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Paid To</label>
                                <input
                                    type="text"
                                    name="paidTo"
                                    value={formData.paidTo}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Enter recipient"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-2">
                            <Button type="button" variant="danger" onClick={handleReset}>Reset</Button>
                            <Button type="submit" variant="success" disabled={loading}>
                                {loading ? 'Adding...' : 'Add Expense'}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}
        </div>
    )
};

export default Expenditure;