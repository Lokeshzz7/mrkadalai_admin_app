import React, { useState, useEffect } from 'react'
import Card from '../ui/Card';
import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Briefcase, X, Building, UserCheck} from 'lucide-react';
import { apiRequest } from '../../utils/api';
import toast from 'react-hot-toast';
import Loader from '../ui/Loader';

const Onboarding = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('admin');
    const [adminList, setAdminList] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [selectedOutlets, setSelectedOutlets] = useState([]);
    const [staffRole, setStaffRole] = useState('');
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'admin') {
            fetchAdminList();
        } else {
            fetchStaffList();
        }
        fetchOutlets();
    }, [activeTab]);

    const fetchOutlets = async () => {
        try {
            const response = await apiRequest('/superadmin/get-outlets');
            setOutlets(response.outlets || []);
        } catch (err) {
            console.error('Error fetching outlets:', err);
        }
    };

    const handleAdminVerify = async (adminId) => {
        try {
            setModalLoading(true);
            const response = await apiRequest(`/superadmin/verify-admin/${adminId}`, {
                method: 'POST',
                body: JSON.stringify({
                    outletIds: selectedOutlets
                })
            });
            toast.success('Admin verified successfully!');
            setAdminList(prev => prev.filter(admin => admin.id !== adminId));
            setShowModal(false);
            resetModalState();
        } catch (err) {
            console.error('Admin verification failed:', err.message);
            toast.error(err.message || 'Admin verification failed');
        } finally {
            setModalLoading(false);
        }
    };

    const handleStaffVerify = async (staffId) => {
        try {
            setModalLoading(true);
            const response = await apiRequest(`/superadmin/verify-staff/${staffId}`, {
                method: 'POST',
                body: JSON.stringify({
                    outletId: selectedOutlets[0],
                    staffRole: staffRole
                })
            });
            toast.success('Staff verified successfully!');
            setStaffList(prev => prev.filter(staff => staff.id !== staffId));
            setShowModal(false);
            resetModalState();
        } catch (err) {
            console.error('Staff verification failed:', err.message);
            toast.error(err.message || 'Staff verification failed');
        } finally {
            setModalLoading(false);
        }
    };

    const fetchAdminList = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiRequest('/superadmin/pending-admins');
            console.log('Admin response:', response);
            setAdminList(response);
        } catch (err) {
            setError('Failed to fetch admin list');
            console.error('Error fetching admin:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaffList = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiRequest('/superadmin/unverified-staff');
            console.log('Staff response:', response);
            setStaffList(response);
        } catch (err) {
            setError('Failed to fetch staff list');
            console.error('Error fetching staff:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const openModal = (person) => {
        setSelectedPerson(person);
        setShowModal(true);
        setSelectedOutlets([]);
        setStaffRole('');
    };

    const closeModal = () => {
        setShowModal(false);
        resetModalState();
    };

    const resetModalState = () => {
        setSelectedPerson(null);
        setSelectedOutlets([]);
        setStaffRole('');
    };

    const handleOutletChange = (outletId, isChecked) => {
        if (activeTab === 'admin') {
            // Multiple selection for admin
            if (isChecked) {
                setSelectedOutlets(prev => [...prev, outletId]);
            } else {
                setSelectedOutlets(prev => prev.filter(id => id !== outletId));
            }
        } else {
            // Single selection for staff
            setSelectedOutlets(isChecked ? [outletId] : []);
        }
    };

    const handleVerifyInModal = () => {
        if (activeTab === 'admin') {
            if (selectedOutlets.length === 0) {
                toast.error('Please select at least one outlet for admin');
                return;
            }
            handleAdminVerify(selectedPerson.id);
        } else {
            if (selectedOutlets.length === 0) {
                toast.error('Please select an outlet for staff');
                return;
            }
            if (!staffRole.trim()) {
                toast.error('Please enter staff role');
                return;
            }
            handleStaffVerify(selectedPerson.id);
        }
    };

    const currentList = activeTab === 'admin' ? adminList : staffList;
    const currentRole = activeTab === 'admin' ? 'admin' : 'staff';

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="flex justify-center items-center"><Loader/></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Heading */}
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">
                    {activeTab === 'admin' ? 'Admin Onboarding' : 'Staff Onboarding'}
                </h1>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => handleTabChange('admin')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'admin'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Admin
                    </button>
                    <button
                        onClick={() => handleTabChange('staff')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'staff'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Staff
                    </button>
                </nav>
            </div>

            {/* List Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {currentList.map((person) => (
                    <Card
                        key={person.id}
                        title=""
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        <div className="flex">
                            <div className="w-1/3">
                                <div className="h-full w-full bg-gray-200 rounded-l-lg flex items-center justify-center">
                                    <User className="w-12 h-12 text-gray-400" />
                                </div>
                            </div>

                            {/* Right: Person Info */}
                            <div className="w-2/3 p-4 space-y-2 text-sm">
                                <p className="flex items-center gap-2 font-bold text-lg">
                                    <User className="w-4 h-4 text-gray-700" />
                                    {person.name || 'N/A'}
                                </p>
                                <p className="flex items-center gap-2 text-gray-600">
                                    <Mail className="w-4 h-4 text-gray-700 shrink-0" />
                                    {person.email || 'N/A'}
                                </p>
                                <p className="flex items-center gap-2 text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    {person.phone || 'N/A'}
                                </p>
                                <p className="flex items-center gap-2 text-gray-600">
                                    <Briefcase className="w-4 h-4" />
                                    {currentRole}
                                </p>
                                <div className='flex justify-center mt-3'>
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openModal(person);
                                        }}
                                        className="w-full"
                                    >
                                        Verify
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {currentList.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        No {currentRole} members found
                    </p>
                </div>
            )}

            {/* Modal */}
            {showModal && selectedPerson && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-2xl font-bold">
                                Verify {currentRole === 'admin' ? 'Admin' : 'Staff'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Personal Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Personal Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <User className="w-5 h-5 text-gray-600" />
                                            <span className="font-medium">Name:</span>
                                            <span>{selectedPerson.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-5 h-5 text-gray-600" />
                                            <span className="font-medium">Email:</span>
                                            <span>{selectedPerson.email || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-5 h-5 text-gray-600" />
                                            <span className="font-medium">Phone:</span>
                                            <span>{selectedPerson.phone || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-gray-600" />
                                            <span className="font-medium">Role:</span>
                                            <span className="capitalize">{currentRole}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Document Images */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Documents</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium mb-2">Aadhaar Card</p>
                                            <img
                                                src="https://via.placeholder.com/200x120/e5e7eb/6b7280?text=Aadhaar+Card"
                                                alt="Aadhaar Card"
                                                className="w-full h-24 object-cover rounded border"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium mb-2">PAN Card</p>
                                            <img
                                                src="https://via.placeholder.com/200x120/e5e7eb/6b7280?text=PAN+Card"
                                                alt="PAN Card"
                                                className="w-full h-24 object-cover rounded border"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Outlet Selection */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Building className="w-5 h-5" />
                                    Outlet Assignment
                                </h3>

                                {activeTab === 'admin' ? (
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">Select multiple outlets for admin access:</p>
                                        <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-3">
                                            {outlets.map((outlet) => (
                                                <label key={outlet.id} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedOutlets.includes(outlet.id)}
                                                        onChange={(e) => handleOutletChange(outlet.id, e.target.checked)}
                                                        className="rounded border-gray-300"
                                                    />
                                                    <span className="text-sm">
                                                        {outlet.name} - {outlet.address}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Select outlet:</p>
                                            <select
                                                value={selectedOutlets[0] || ''}
                                                onChange={(e) => handleOutletChange(parseInt(e.target.value), e.target.value !== '')}
                                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select an outlet</option>
                                                {outlets.map((outlet) => (
                                                    <option key={outlet.id} value={outlet.id}>
                                                        {outlet.name} - {outlet.address}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Staff Role:</p>
                                            <input
                                                type="text"
                                                value={staffRole}
                                                onChange={(e) => setStaffRole(e.target.value)}
                                                placeholder="Enter staff role (e.g., Cashier, Manager, etc.)"
                                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                            <Button
                                onClick={closeModal}
                                className="bg-gray-500 hover:bg-gray-600"
                                disabled={modalLoading}
                            >
                                Close
                            </Button>
                            <Button
                                onClick={handleVerifyInModal}
                                className="bg-green-600 hover:bg-green-700"
                                disabled={modalLoading}
                            >
                                {modalLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Verifying...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <UserCheck className="w-4 h-4" />
                                        Verify {currentRole === 'admin' ? 'Admin' : 'Staff'}
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Onboarding