import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import college from '../../assets/college.jpg';
import Header from '../../components/Header.jsx';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('admin');
    const navigate = useNavigate();

    const collegeData = [
        { id: 1, name: 'Chennai Institute of Technology', image: college },
        { id: 2, name: 'Saveetha Engineering College', image: college },
        { id: 3, name: 'Rajalakshmi Institute of Technology', image: college },
        { id: 4, name: 'PSG, Tech Coimbatore', image: college },
        { id: 5, name: 'Valliammai Engineering College', image: college },
        { id: 6, name: 'SVC Engineering College', image: college },
    ];

    const handleCollege = (college) => {
        localStorage.setItem('collegeName', college.name);
        navigate('/order-history');
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
            <div className="w-full z-30">
                <Header onMenuClick={() => setSidebarOpen(true)} />
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
                                <Button variant='success'>Add Outlet</Button>
                                <Button variant="danger">Remove Outlet</Button>
                            </div>
                        </div>
                    )}

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
                                        <p> For checking the length</p>
                                    </Card>
                                </div>
                                <Card Black title="Reports" />
                                <Card Black title="Reports" />
                                <Card Black title="Reports" />
                                <Card Black title="Reports" />
                            </div>
                        </>
                    )}

                    {activeTab === 'outlet' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20">
                            {collegeData.map((college) => (
                                <div
                                    key={college.id}
                                    onClick={() => handleCollege(college)}
                                    className="cursor-pointer"
                                >
                                    <Card Black className="text-center p-2">
                                        <img
                                            src={college.image}
                                            alt={college.name}
                                            className="h-24 w-full object-cover rounded-lg"
                                        />
                                        <p className="text-sm font-semibold mt-2">
                                            {college.name}
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
