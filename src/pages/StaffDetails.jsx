import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { staffList } from '../data/staffData'; // <-- Move your data to this file
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const StaffDetails = () => {
    const [activeTab, setActiveTab] = useState('details')

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
        <div className='space-y-6'>

            <div className='flex justify-between items-center'>
                <div className='flex space-x-4'>
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
            {activeTab === 'details' && (
                <Card title={staff.name} className="max-w-4xl mx-auto mt-8">
                    <div className="flex justify-center mb-6">
                        <img
                            src={formData.image}
                            alt={formData.name}
                            className="w-40 h-40 rounded-full object-cover"
                        />
                    </div>

                    {/* 2-column form */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`mt-1 block w-full border rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-100 ${!isEditing ? 'cursor-not-allowed' : ''}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Position</label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`mt-1 block w-full border rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-100 ${!isEditing ? 'cursor-not-allowed' : ''}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`mt-1 block w-full border rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-100 ${!isEditing ? 'cursor-not-allowed' : ''}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="tel"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`mt-1 block w-full border rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-100 ${!isEditing ? 'cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>

                    {/* Bottom Buttons */}
                    <div className="flex justify-between">
                        <Button variant="outline" onClick={() => navigate(-1)}>
                            &larr; Back
                        </Button>
                        <Button variant={isEditing ? "success" : "primary"} onClick={handleToggleEdit}>
                            {isEditing ? "Save Details" : "Update Details"}
                        </Button>
                    </div>
                </Card>
            )
            }

            {
                activeTab === 'permission' && (
                    <div>
                        <Card title={staff.name} className="max-w-4xl mx-auto mt-8">
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
                                                className={`relative inline-flex items-center  ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                                    }`}
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
                                                {/* Track with red/green color */}
                                                <div
                                                    className={`w-11 h-6 rounded-full transition-colors duration-200 ${formData[item.key] ? 'bg-green-500' : 'bg-red-500'
                                                        }`}
                                                ></div>

                                                {/* Thumb that moves when checked */}
                                                <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all peer-checked:translate-x-full"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Buttons */}
                            <div className="flex justify-between mt-6">
                                <Button variant="outline" onClick={() => navigate(-1)}>
                                    &larr; Back
                                </Button>
                                <Button variant={isEditing ? "success" : "primary"} onClick={handleToggleEdit}>
                                    {isEditing ? "Save Details" : "Update Details"}
                                </Button>
                            </div>
                        </Card>



                    </div>
                )
            }

        </div >
    );
};

export default StaffDetails;
