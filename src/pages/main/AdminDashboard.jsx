import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import college from '../../assets/college.jpg'
import Header from '../../components/Header.jsx'


const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('admin');
    const navigate = useNavigate();

    const collegeData = [
        {
            id: 1,
            name: 'Chennai Institute of Techonology',
            image: college,
        },
        {
            id: 2,
            name: 'Saveetha Engieering college',
            image: college,
        },
        {
            id: 3,
            name: 'Rajalakshmi Institute of Technology',
            image: college,
        },
        {
            id: 4,
            name: 'PSG , tech coimbatore',
            image: college,
        },
        {
            id: 5,
            name: 'Valliamal Engineering College',
            image: college,
        },
        {
            id: 6,
            name: 'SVC Engineering college ',
            image: college,
        },
    ];

    const handleCollege = async (college) => {
        localStorage.setItem('collegeName', college.name);
        navigate('/home');
    }

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

                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-700">Admin Dashboard</h1>

                        <div className="flex space-x-4">
                            <Button>
                                Add Outlet
                            </Button>
                            <Button
                                variant='danger'
                            >
                                Remove Outlet
                            </Button>
                        </div>
                    </div>


                    {activeTab === 'admin' && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                <Card Black className="text-center">
                                    <p className="text-gray-600">Today's Sales</p>
                                    <h2 className="text-2xl font-bold text-blue-600">45</h2>
                                </Card>

                                <Card Black className="text-center">
                                    <p className="text-gray-600">Manual Order</p>
                                    <h2 className="text-2xl font-bold  ">340</h2>
                                </Card>

                                <Card Black className="text-center">
                                    <p className="text-gray-600">App Orders</p>
                                    <h2 className="text-2xl font-bold text-orange-600">23</h2>
                                </Card>

                                <Card Black className="text-center">
                                    <p className="text-gray-600">Wallet Recharges</p>
                                    <h2 className="text-2xl font-bold text-yellow-600">12</h2>
                                </Card>
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                <div className='row-span-2'>
                                    <Card
                                        Black
                                        title='Reports'
                                    >
                                        <p> For checking the length</p>

                                    </Card>
                                </div>
                                <div>
                                    <Card
                                        Black
                                        title='Reports'
                                    >

                                    </Card>
                                </div>
                                <div>
                                    <Card
                                        Black
                                        title='Reports'
                                    >

                                    </Card>
                                </div>
                                <div>
                                    <Card
                                        Black
                                        title='Reports'
                                    >

                                    </Card>
                                </div>
                                <div>
                                    <Card
                                        Black
                                        title='Reports'
                                    >

                                    </Card>
                                </div>

                            </div>
                        </>
                    )}

                    {activeTab === 'outlet' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-9">

                            {collegeData.map((college) => (
                                <div key={college.id} onClick={() => handleCollege(college)} className='cursor-pointer'>
                                    <Card
                                        Black
                                    >
                                        <img
                                            src={college.image}
                                            alt={college.name}

                                        />

                                        <p className='text-lg font-bold  mt-4'>
                                            {college.name}
                                        </p>
                                    </Card>
                                </div>
                            ))}

                        </div>
                    )}
                </div>
            </main >
        </div >
    );
};

export default AdminDashboard;
