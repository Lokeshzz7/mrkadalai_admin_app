import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { staffList } from '../data/staffData';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const StaffDetails = () => {
    const [activeTab, setActiveTab] = useState('details');

    const { id } = useParams();
    const navigate = useNavigate();

    const staff = staffList.find(s => s.id === parseInt(id));
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...staff });

    if (!staff) {
        return <div>Staff member not found.</div>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleToggleEdit = () => {
        if (isEditing) {
            console.log("Saving data:", formData);
        }
        setIsEditing(!isEditing);
    };

    return (
        <div className="space-y-6">

            {/* Top Row: Back button + Tabs */}
            <div className="flex justify-start items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="rounded-full bg-gray-200 hover:bg-gray-300 p-2"
                >   
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-black"
                    >
                        <polygon points="15,5 7,12 15,19" />
                    </svg>
                    {/* <Triangle className="w-5 h-5 transform -rotate-90" /> */}
                </button>

                <div className="flex space-x-4">
                    <Button
                        variant={activeTab === 'details' ? 'black' : 'secondary'}
                        onClick={() => setActiveTab('details')}
                    >
                        Staff Details
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
                <Card title={staff.name} className="max-w-4xl mx-auto mt-8">
                    <div className="flex justify-center mb-6">
                        <img
                            src={formData.image}
                            alt={formData.name}
                            className="w-40 h-40 rounded-full object-cover"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                        {[
                            ['name', 'Name'],
                            ['position', 'Position'],
                            ['email', 'Email'],
                            ['number', 'Phone']
                        ].map(([field, label]) => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-gray-700">{label}</label>
                                <input
                                    type={field === 'email' ? 'email' : 'text'}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`mt-1 block w-full border rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-100 ${!isEditing ? 'cursor-not-allowed' : ''}`}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Centered Update Button */}
                    <div className="flex justify-center gap-4">
                        <Button variant={isEditing ? "primary" : "black"} onClick={handleToggleEdit}>
                            {isEditing ? "Save Details" : "Update Details"}
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => {
                                const confirmDelete = window.confirm("Are you sure you want to remove this staff member?");
                                if (confirmDelete) {
                                    // Here you can add the actual remove logic if needed
                                    navigate('/staff');
                                }
                            }}
                        >
                            Remove Staff
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
                                { key: 'ProductsInsight', label: 'Product Insight' },
                                { key: 'Inventory', label: 'Inventory' },
                                { key: 'Reports', label: 'Reports' },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between">
                                    <span>{item.label}</span>
                                    <label
                                        className={`relative inline-flex items-center ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={formData[item.key] || false}
                                            disabled={!isEditing}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    [item.key]: e.target.checked
                                                }))
                                            }
                                        />
                                        <div
                                            className={`w-11 h-6 rounded-full transition-colors duration-200 ${formData[item.key] ? 'bg-theme' : 'bg-black'}`}
                                        ></div>
                                        <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all peer-checked:translate-x-full"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Centered Button */}
                    <div className="flex justify-center mt-6">
                        <Button variant={isEditing ? "primary" : "black"} onClick={handleToggleEdit}>
                            {isEditing ? "Save Details" : "Update Details"}
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default StaffDetails;
