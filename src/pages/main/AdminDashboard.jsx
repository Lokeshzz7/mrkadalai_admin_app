import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import college from '../../assets/college.jpg';
import Header from '../../components/Header.jsx';
import { apiRequest } from '../../utils/api.js'; // Make sure this path is correct

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('admin');
    const [outlets, setOutlets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedOutlet, setSelectedOutlet] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        staffCount: 0
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchOutlets();
    }, []);

    const fetchOutlets = async () => {
        try {
            const data = await apiRequest('/admin/get-outlets/');
            console.log(data);
            setOutlets(data.outlets);
        } catch (error) {
            console.error(error.message);
            alert('Failed to load outlets');
        }
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        try {
            await apiRequest('/admin/add-outlet/', {
                method: 'POST',
                body: formData,
            });
            alert('Outlet added successfully');
            setFormData({ name: '', address: '', phone: '', email: '', staffCount: 0 });
            setIsModalOpen(false);
            fetchOutlets();
        } catch (err) {
            console.error(err.message);
            alert(err.message || 'Error adding outlet');
        }
    };

    const handleRemove = async () => {
        if (!selectedOutlet) return alert('Select a valid outlet to remove');
        try {
            await apiRequest(`/admin/remove-outlet/${selectedOutlet.id}/`, {
                method: 'DELETE',
            });
            alert('Outlet removed successfully');
            setSelectedOutlet(null);
            setIsModalOpen(false);
            fetchOutlets();
        } catch (err) {
            console.error(err.message);
            alert(err.message || 'Error removing outlet');
        }
    };

    const handleCollege = (college) => {
        localStorage.setItem('outletName', college.name);
        localStorage.setItem('outletId', college.id); 
        navigate('/order-history');
    };

    const openAddModal = () => {
        setModalMode('add');
        setFormData({ name: '', address: '', phone: '', email: '', staffCount: 0 });
        setIsModalOpen(true);
    };

    const openRemoveModal = () => {
        setModalMode('remove');
        setSelectedOutlet(null);
        setIsModalOpen(true);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
            <div className="w-full z-30">
                <Header onMenuClick={() => {}} />
            </div>

            <main className="flex-1 bg-bg p-4 sm:p-6 overflow-auto ml-0">
                <div className="h-full space-y-6">
                    <div className="flex justify-start space-x-4">
                        <Button
                            variant={activeTab === 'admin' ? 'black' : 'secondary'}
                            onClick={() => setActiveTab('admin')}
                        >
                            Admin
                        </Button>
                        <Button
                            variant={activeTab === 'outlet' ? 'black' : 'secondary'}
                            onClick={() => setActiveTab('outlet')}
                        >
                            Outlet
                        </Button>
                    </div>

                    {activeTab === 'outlet' && (
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-semibold text-gray-700">Outlet Overview</h1>
                            <div className="flex space-x-4">
                                <Button variant="success" onClick={openAddModal}>Add Outlet</Button>
                                <Button variant="danger" onClick={openRemoveModal}>Remove Outlet</Button>
                            </div>
                        </div>
                    )}

                    {/* ADD OUTLET MODAL */}
                    <Modal
                        isOpen={isModalOpen && modalMode === 'add'}
                        onClose={() => setIsModalOpen(false)}
                        title={
                            <div className="flex justify-between items-center w-full">
                                <span>Add Outlet</span>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="ml-auto bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center"
                                >
                                    ✕
                                </button>
                            </div>
                        }
                        footer={
                            <Button variant="black" onClick={handleSave}>
                                Save
                            </Button>
                        }
                    >
                        <form className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">College Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="College Name"
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Address"
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleInputChange}
                                        placeholder="Email Address"
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Staff Count</label>
                                    <input
                                        type="number"
                                        name="staffCount"
                                        value={formData.staffCount}
                                        onChange={handleInputChange}
                                        placeholder="Staff Count"
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Phone Number"
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                </div>
                            </div>
                        </form>
                    </Modal>

                    {/* REMOVE OUTLET MODAL */}
                    <Modal
                        isOpen={isModalOpen && modalMode === 'remove'}
                        onClose={() => setIsModalOpen(false)}
                        title={
                            <div className="flex justify-between items-center w-full">
                                <span>Remove Outlet</span>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="ml-auto bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center"
                                >
                                    ✕
                                </button>
                            </div>
                        }
                        footer={
                            <div className="flex space-x-3">
                                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={handleRemove}>
                                    Remove
                                </Button>
                            </div>
                        }
                    >
                        <div className="space-y-4">
                            <p className="text-gray-600">Select an outlet to remove:</p>
                            <select
                                value={selectedOutlet ? selectedOutlet.id: ''}
                                onChange={(e) => {
                                    const outlet = outlets.find(o => o.id === parseInt(e.target.value));
                                    setSelectedOutlet(outlet);
                                }}
                                className="w-full px-4 py-2 border rounded"
                            >
                                <option value="">Select an outlet...</option>
                                {outlets.map((outlet) => (
                                    <option key={outlet.id} value={outlet.id}>
                                        {outlet.name} - {outlet.address}
                                    </option>
                                ))}
                            </select>
                            {selectedOutlet && (
                                <div className="bg-red-50 border border-red-200 rounded p-3">
                                    <p className="text-red-800 text-sm">
                                        <strong>Warning:</strong> This will permanently delete "{selectedOutlet.name}" and all associated data.
                                    </p>
                                </div>
                            )}
                        </div>
                    </Modal>

                    {/* ADMIN TAB */}
                    {activeTab === 'admin' && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                <Card Black className="text-center">
                                    <p className="text-gray-600">Today's Active Stores</p>
                                    <h2 className="text-2xl font-bold text-green-600">12</h2>
                                </Card>
                                <Card Black className="text-center">
                                    <p className="text-gray-600">Total Revenue</p>
                                    <h2 className="text-2xl font-bold text-blue-600">₹1.2L</h2>
                                </Card>
                                <Card Black className="text-center">
                                    <p className="text-gray-600">Total Customers</p>
                                    <h2 className="text-2xl font-bold text-purple-600">830</h2>
                                </Card>
                                <Card Black className="text-center">
                                    <p className="text-gray-600">Today's Orders</p>
                                    <h2 className="text-2xl font-bold text-orange-600">102</h2>
                                </Card>
                                <Card Black className="text-center">
                                    <p className="text-gray-600">Top Performing Store</p>
                                    <h2 className="text-2xl font-bold text-yellow-600">CIT</h2>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="row-span-2">
                                    <Card Black title="Reports">
                                        <p>For checking the length</p>
                                    </Card>
                                </div>
                                <Card Black title="Reports" />
                                <Card Black title="Reports" />
                                <Card Black title="Reports" />
                                <Card Black title="Reports" />
                            </div>
                        </>
                    )}

                    {/* OUTLET TAB */}
                    {activeTab === 'outlet' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20">
                            {outlets.map((outlet) => (
                                <div
                                    key={outlet.id}
                                    onClick={() => handleCollege(outlet)}
                                    className="cursor-pointer"
                                >
                                    <Card Black className="text-center p-2">
                                        <img
                                            src={outlet.image || college}
                                            alt={outlet.name}
                                            className="h-24 w-full object-cover rounded-lg"
                                        />
                                        <p className="text-sm font-semibold mt-2">
                                            {outlet.name}
                                        </p>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;