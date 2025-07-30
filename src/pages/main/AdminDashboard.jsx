import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import college from '../../assets/college.jpg';
import Header from '../../components/Header.jsx';
import { apiRequest } from '../../utils/api.js';
import Onboarding from '../../components/dashboard/Onboarding.jsx';
import AdminManagment from '../../components/dashboard/AdminManagement.jsx';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

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
    const { setCurrentOutlet, getAccessibleRoutes } = useAuth();

    // Dashboard data states
    const [dashboardData, setDashboardData] = useState({
        totalActiveOutlets: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        totalOrders: 0,
        topPerformingOutlet: null
    });
    const [revenueData, setRevenueData] = useState([]);
    const [orderStatusData, setOrderStatusData] = useState([]);
    const [orderSourceData, setOrderSourceData] = useState([]);
    const [topSellingItems, setTopSellingItems] = useState([]);
    const [peakTimeSlots, setPeakTimeSlots] = useState([]);
    const [dateRange, setDateRange] = useState({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();

    const isSuperAdmin = user?.role === 'SUPERADMIN';

    const navigate = useNavigate();

    useEffect(() => {
        fetchOutlets();
        fetchDashboardData();
    }, []);


    useEffect(() => {
        if (!isSuperAdmin && (activeTab === 'Onboarding' || activeTab === 'AdminManagement')) {
            setActiveTab('admin');
        }
    }, [isSuperAdmin, activeTab]);

    useEffect(() => {
        fetchChartsData();
    }, [dateRange]);

    const fetchOutlets = async () => {
        try {
            const data = await apiRequest('/superadmin/get-outlets/');
            setOutlets(data.outlets);
        } catch (error) {
            console.error(error.message);
            toast.error('Failed to load outlets');
        }
    };

    const fetchDashboardData = async () => {
        try {
            const data = await apiRequest('/superadmin/dashboard/overview');
            setDashboardData(data);
        } catch (error) {
            console.error('Failed to fetch dashboard overview:', error);
            toast.error('Failed to load dashboard data');
        }
    };

    const fetchChartsData = async () => {
        setLoading(true);
        try {
            const [revenueResponse, statusResponse, sourceResponse, topItemsResponse, peakSlotsResponse] = await Promise.all([
                apiRequest('/superadmin/dashboard/revenue-trend', {
                    method: 'POST',
                    body: dateRange
                }),
                apiRequest('/superadmin/dashboard/order-status-distribution', {
                    method: 'POST',
                    body: dateRange
                }),
                apiRequest('/superadmin/dashboard/order-source-distribution', {
                    method: 'POST',
                    body: dateRange
                }),
                apiRequest('/superadmin/dashboard/top-selling-items', {
                    method: 'POST',
                    body: dateRange
                }),
                apiRequest('/superadmin/dashboard/peak-time-slots', {
                    method: 'POST',
                    body: dateRange
                })
            ]);

            setRevenueData(revenueResponse);

            const statusData = [
                { name: 'Delivered', value: statusResponse.delivered, color: '#10B981' },
                { name: 'Pending', value: statusResponse.pending, color: '#F59E0B' },
                { name: 'Cancelled', value: statusResponse.cancelled, color: '#EF4444' },
                { name: 'Partially Delivered', value: statusResponse.partiallyDelivered, color: '#6366F1' }
            ];
            setOrderStatusData(statusData);

            const sourceData = [
                { name: 'App Orders', value: sourceResponse.appOrders, color: '#3B82F6' },
                { name: 'Manual Orders', value: sourceResponse.manualOrders, color: '#8B5CF6' }
            ];
            setOrderSourceData(sourceData);

            setTopSellingItems(topItemsResponse);
            setPeakTimeSlots(peakSlotsResponse);
        } catch (error) {
            console.error('Failed to fetch charts data:', error);
            toast.error('Failed to load charts data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleDateRangeChange = (e) => {
        setDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        try {
            await apiRequest('/superadmin/add-outlet/', {
                method: 'POST',
                body: formData,
            });
            toast.success('Outlet added successfully');
            setFormData({ name: '', address: '', phone: '', email: '', staffCount: 0 });
            setIsModalOpen(false);
            fetchOutlets();
        } catch (err) {
            console.error(err.message);
            toast.error(err.message || 'Error adding outlet');
        }
    };

    const handleRemove = async () => {
        if (!selectedOutlet) return toast.error('Select a valid outlet to remove');
        try {
            await apiRequest(`/superadmin/remove-outlet/${selectedOutlet.id}/`, {
                method: 'DELETE',
            });
            toast.success('Outlet removed successfully');
            setSelectedOutlet(null);
            setIsModalOpen(false);
            fetchOutlets();
        } catch (err) {
            console.error(err.message);
            toast.error(err.message || 'Error removing outlet');
        }
    };

    const handleCollege = (college) => {
        // Set the outlet information
        localStorage.setItem('outletName', college.name);
        localStorage.setItem('outletId', college.id);

        // Get accessible routes for this specific outlet (before setting it as current)
        const accessibleRoutes = getAccessibleRoutes(college.id);

        // Find the first accessible route (excluding home page if possible)
        let targetRoute = '/'; // fallback to home
        let showNoRouteAlert = false;

        if (accessibleRoutes.length > 0) {
            // Try to find a route other than home first
            const nonHomeRoute = accessibleRoutes.find(route => route.href !== '/');
            if (nonHomeRoute) {
                targetRoute = nonHomeRoute.href;
            } else {
                // Only home route is accessible
                targetRoute = accessibleRoutes[0].href;
                showNoRouteAlert = true;
            }
        } else {
            // No routes accessible at all
            showNoRouteAlert = true;
        }

        // Set the current outlet in context AFTER determining the route
        setCurrentOutlet(college.id);

        // Show alert if only home route or no routes available
        if (showNoRouteAlert) {
            // Option 1: Using window.alert
            toast.error(`No accessible routes found for ${college.name}. You will be redirected to the dashboard.`);

            // Option 2: Using react-hot-toast (if you have it imported)
            // toast.warning(`No accessible routes found for ${college.name}. Redirecting to dashboard.`);

            // Option 3: Using a custom notification system
            // showNotification({
            //     type: 'warning',
            //     title: 'Limited Access',
            //     message: `No accessible routes found for ${college.name}. You will be redirected to the dashboard.`
            // });
        }

        // Navigate to the determined route
        navigate(targetRoute);
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded shadow">
                    <p className="font-medium">{`Date: ${label}`}</p>
                    <p className="text-blue-600">{`Revenue: ${formatCurrency(payload[0].value)}`}</p>
                </div>
            );
        }
        return null;
    };

    const PieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded shadow">
                    <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
            <div className="w-full z-30">
                <Header onMenuClick={() => { }} />
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
                        {isSuperAdmin && (
                            <>
                                <Button
                                    variant={activeTab === 'Onboarding' ? 'black' : 'secondary'}
                                    onClick={() => setActiveTab('Onboarding')}>
                                    OnBoarding
                                </Button>
                                <Button
                                    variant={activeTab === 'AdminManagement' ? 'black' : 'secondary'}
                                    onClick={() => setActiveTab('AdminManagement')}>
                                    Admin Management
                                </Button>
                            </>
                        )}
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
                                value={selectedOutlet ? selectedOutlet.id : ''}
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
                            {/* Dashboard Overview Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                <Card Black className="text-center">
                                    <p className="text-gray-600">Today's Active Stores</p>
                                    <h2 className="text-2xl font-bold text-green-600">{dashboardData.totalActiveOutlets}</h2>
                                </Card>
                                <Card Black className="text-center">
                                    <p className="text-gray-600">Total Revenue</p>
                                    <h2 className="text-2xl font-bold text-blue-600">{formatCurrency(dashboardData.totalRevenue)}</h2>
                                </Card>
                                <Card Black className="text-center">
                                    <p className="text-gray-600">Total Customers</p>
                                    <h2 className="text-2xl font-bold text-purple-600">{dashboardData.totalCustomers}</h2>
                                </Card>
                                <Card Black className="text-center">
                                    <p className="text-gray-600">Total Orders</p>
                                    <h2 className="text-2xl font-bold text-orange-600">{dashboardData.totalOrders}</h2>
                                </Card>
                                <Card Black className="text-center">
                                    <p className="text-gray-600">Top Performing Store</p>
                                    <h2 className="text-2xl font-bold text-yellow-600">
                                        {dashboardData.topPerformingOutlet?.name || 'N/A'}
                                    </h2>
                                </Card>
                            </div>

                            {/* Date Range Selector */}
                            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
                                <h2 className="text-lg font-semibold text-gray-700">Analytics Dashboard</h2>
                                <div className="flex space-x-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">From</label>
                                        <input
                                            type="date"
                                            name="from"
                                            value={dateRange.from}
                                            onChange={handleDateRangeChange}
                                            className="px-3 py-2 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">To</label>
                                        <input
                                            type="date"
                                            name="to"
                                            value={dateRange.to}
                                            onChange={handleDateRangeChange}
                                            className="px-3 py-2 border rounded"
                                        />
                                    </div>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                <>
                                    {/* Charts Section */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Revenue Trend Chart */}
                                        <div className="lg:col-span-2">
                                            <Card Black title="Revenue Trend">
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <LineChart data={revenueData}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="date" />
                                                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend />
                                                        <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </Card>
                                        </div>

                                        {/* Order Status Distribution */}
                                        <div>
                                            <Card Black title="Order Status Distribution">
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <PieChart>
                                                        <Pie
                                                            data={orderStatusData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={80}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                        >
                                                            {orderStatusData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip content={<PieTooltip />} />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </Card>
                                        </div>
                                    </div>

                                    {/* Second Row Charts */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Order Source Distribution */}
                                        <div>
                                            <Card Black title="Order Source Distribution">
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <PieChart>
                                                        <Pie
                                                            data={orderSourceData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={80}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                        >
                                                            {orderSourceData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip content={<PieTooltip />} />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </Card>
                                        </div>

                                        {/* Top Selling Items */}
                                        <div>
                                            <Card Black title="Top Selling Items">
                                                <div className="space-y-4">
                                                    {topSellingItems.length > 0 ? (
                                                        <>
                                                            {/* Highlight top item */}
                                                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-lg text-white">
                                                                <h3 className="font-bold text-lg">🏆 #{1}</h3>
                                                                <p className="font-semibold">{topSellingItems[0].productName}</p>
                                                                <p className="text-sm">Orders: {topSellingItems[0].totalOrders}</p>
                                                                <p className="text-sm">Revenue: {formatCurrency(topSellingItems[0].totalRevenue)}</p>
                                                            </div>

                                                            {/* Other top items */}
                                                            {topSellingItems.slice(1).map((item, index) => (
                                                                <div key={item.productId} className="bg-gray-50 p-3 rounded-lg">
                                                                    <div className="flex justify-between items-start">
                                                                        <div>
                                                                            <h4 className="font-medium">#{index + 2} {item.productName}</h4>
                                                                            <p className="text-sm text-gray-600">Orders: {item.totalOrders}</p>
                                                                            <p className="text-sm text-gray-600">Revenue: {formatCurrency(item.totalRevenue)}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </>
                                                    ) : (
                                                        <p className="text-gray-500 text-center py-8">No data available</p>
                                                    )}
                                                </div>
                                            </Card>
                                        </div>

                                        {/* Peak Time Slots */}
                                        <div>
                                            <Card Black title="Peak Time Slots">
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <BarChart data={peakTimeSlots}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="displayName" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Bar dataKey="orderCount" fill="#8884d8" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </Card>
                                        </div>
                                    </div>
                                </>
                            )}
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

                    {activeTab === 'Onboarding' && isSuperAdmin && (
                        <>
                            <Onboarding />
                        </>
                    )}

                    {activeTab === 'AdminManagement' && isSuperAdmin && (
                        <>
                            <AdminManagment />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;