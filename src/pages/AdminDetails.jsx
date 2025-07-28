import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { User } from 'lucide-react';
import { apiRequest } from '../utils/api';
import toast from 'react-hot-toast';

const AdminDetails = () => {
    const [activeTab, setActiveTab] = useState('details');
    const [admin, setadmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { id } = useParams();
    const navigate = useNavigate();

    // Separate editing states for each tab
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [isEditingPermissions, setIsEditingPermissions] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        adminRole: '',
        billing: false,
        productsInsight: false,
        inventory: false,
        reports: false,
    });

    useEffect(() => {
        fetchadminDetails();
    }, [id]);

    const fetchadminDetails = async () => {
        try {
            setLoading(true);
            const response = await apiRequest(`/superadmin/verify-admin/${id}`, {
                method: 'POST'
            });
            console.groupCollapsed("Admin Data");
            console.log(response);
            const adminMember = response.admin;
            console.log(adminMember)
            if (adminMember) {
                setadmin(adminMember);

                // const permissions = {};
                // adminMember.permissions?.forEach((perm) => {
                //     switch (perm.type) {
                //         case 'BILLING':
                //             permissions.billing = perm.isGranted;
                //             break;
                //         case 'PRODUCT_INSIGHTS':
                //             permissions.productsInsight = perm.isGranted;
                //             break;
                //         case 'INVENTORY':
                //             permissions.inventory = perm.isGranted;
                //             break;
                //         case 'REPORTS':
                //             permissions.reports = perm.isGranted;
                //             break;
                //         default:
                //             break;
                //     }
                // });

                setFormData({
                    name: adminMember.name || '',
                    email: adminMember.email || '',
                    // phone: adminMember.user?.phone || '',
                    // adminRole: adminMember.adminRole || '',
                    // billing: permissions.billing || false,
                    // productsInsight: permissions.productsInsight || false,
                    // inventory: permissions.inventory || false,
                    // reports: permissions.reports || false,
                });
            } else {
                setError('admin member not found');
            }
        } catch (err) {
            setError('Failed to fetch admin details');
            console.error('Error fetching admin details:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePermissionChange = (permission, checked) => {
        setFormData((prev) => ({
            ...prev,
            [permission]: checked,
        }));
    };

    // Save admin details only
    const saveadminDetails = async () => {
        try {
            await apiRequest(`/superadmin/outlets/update-admin/${admin.id}`, {
                method: 'PUT',
                body: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    adminRole: formData.adminRole,
                },
            });
            toast.success('admin details updated successfully');
            setIsEditingDetails(false);
            await fetchadminDetails();
        } catch (err) {
            console.error('Error saving admin details:', err);
            toast.error('Failed to save admin details');
        }
    };

    // Save permissions only
    const savePermissions = async () => {
        try {
            const permissionTypeMap = {
                billing: 'BILLING',
                productsInsight: 'PRODUCT_INSIGHTS',
                inventory: 'INVENTORY',
                reports: 'REPORTS',
            };

            for (const key of Object.keys(permissionTypeMap)) {
                await apiRequest('/superadmin/outlets/permissions/', {
                    method: 'POST',
                    body: {
                        adminId: admin.id,
                        permission: permissionTypeMap[key],
                        grant: formData[key],
                    },
                });
            }

            toast.success('Permissions updated successfully');
            setIsEditingPermissions(false);
            await fetchadminDetails();
        } catch (err) {
            console.error('Error saving permissions:', err);
            toast.error('Failed to save permissions');
        }
    };

    const handleDeleteadmin = async () => {
        const confirmDelete = window.confirm(
            'Are you sure you want to remove this admin member?'
        );
        if (confirmDelete) {
            try {
                await apiRequest(`/superadmin/outlets/delete-admin/${admin.id}`, {
                    method: 'DELETE',
                });
                toast.success('admin member deleted successfully');
                navigate('/admin');
            } catch (err) {
                console.error('Error deleting admin:', err);
                toast.error('Failed to delete admin member');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading admin details...</div>
            </div>
        );
    }

    if (error || !admin) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500">{error || 'admin member not found'}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-10">
            {/* Top Row: Back button + Tabs */}
            <div className="flex justify-start items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="rounded-full bg-gray-200 hover:bg-gray-300 p-2"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black">
                        <polygon points="15,5 7,12 15,19" />
                    </svg>
                </button>

                <div className="flex space-x-4">
                    <Button
                        variant={activeTab === 'details' ? 'black' : 'secondary'}
                        onClick={() => setActiveTab('details')}
                    >
                        admin Details
                    </Button>
                    <Button
                        variant={activeTab === 'permission' ? 'black' : 'secondary'}
                        onClick={() => setActiveTab('permission')}
                    >
                        Permission
                    </Button>
                </div>
            </div>

            {/* Details Tab */}
            {activeTab === 'details' && (
                <Card title={admin.name || 'N/A'} className="max-w-4xl mx-auto mt-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-16 h-16 text-gray-400" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                        {console.log(formData)}
                        {[
                            ['name', 'Name'],
                            ['adminRole', 'Position'],
                            ['email', 'Email'],
                            ['phone', 'Phone'],
                        ].map(([field, label]) => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-gray-700">{label}</label>
                                <input
                                    type={field === 'email' ? 'email' : 'text'}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    disabled={!isEditingDetails}
                                    className={`mt-1 block w-full border rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-100 ${!isEditingDetails ? 'cursor-not-allowed' : ''
                                        }`}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center gap-4">
                        {isEditingDetails ? (
                            <>
                                <Button variant="primary" onClick={saveadminDetails}>
                                    Save Details
                                </Button>
                                <Button variant="secondary" onClick={() => setIsEditingDetails(false)}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button variant="black" onClick={() => setIsEditingDetails(true)}>
                                Update Details
                            </Button>
                        )}
                        <Button variant="danger" onClick={handleDeleteadmin}>
                            Remove admin
                        </Button>
                    </div>
                </Card>
            )}

            {/* Permission Tab */}
            {activeTab === 'permission' && (
                <Card title="Enable Permissions" className="max-w-4xl mx-auto mt-8">
                    <div className="grid grid-cols-1 gap-8 items-center">
                        <div className="space-y-6 text-lg">
                            {[
                                { key: 'billing', label: 'Billing' },
                                { key: 'productsInsight', label: 'Product Insight' },
                                { key: 'inventory', label: 'Inventory' },
                                { key: 'reports', label: 'Reports' },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between">
                                    <span>{item.label}</span>
                                    <label
                                        className={`relative inline-flex items-center ${!isEditingPermissions ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={formData[item.key] || false}
                                            disabled={!isEditingPermissions}
                                            onChange={(e) => handlePermissionChange(item.key, e.target.checked)}
                                        />
                                        <div
                                            className={`w-11 h-6 rounded-full transition-colors duration-200 ${formData[item.key] ? 'bg-theme' : 'bg-black'
                                                }`}
                                        ></div>
                                        <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all peer-checked:translate-x-full"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center mt-6 gap-4">
                        {isEditingPermissions ? (
                            <>
                                <Button variant="primary" onClick={savePermissions}>
                                    Save Permissions
                                </Button>
                                <Button variant="secondary" onClick={() => setIsEditingPermissions(false)}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button variant="black" onClick={() => setIsEditingPermissions(true)}>
                                Update Permissions
                            </Button>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default AdminDetails;
