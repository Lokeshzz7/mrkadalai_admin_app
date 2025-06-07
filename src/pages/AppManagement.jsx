import React, { useState } from 'react'
import Button from '../components/ui/Button.jsx';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card.jsx';

const AppManagement = () => {

    const [activeTab, setActiveTab] = useState('staff');
    const [isEditing, setIsEditing] = useState(false);
    const [staffFormData, setStaffFormData] = useState({
        billing: false,
        ProductsInsight: false,
        Inventory: false,
        Expenditure: false,
        Reports: false
    });

    const [mobileFormData, setMobileFormData] = useState({
        billing: false,
        ProductsInsight: false,
        Inventory: false,
        Expenditure: false,
        Reports: false
    });

    const navigate = useNavigate();



    const handleToggleEdit = () => {
        if (isEditing) {
            console.log("Saving data:", formData);
        }
        setIsEditing(!isEditing);
    };

    return (
        <div className='space-y-6'>
            <h1 className='text-4xl font-bold'>App Management </h1>

            <div className="flex justify-between items-center">
                <div className='flex space-x-4'>
                    <Button

                        variant={activeTab === 'staff' ? 'black' : 'secondary'}
                        onClick={() => setActiveTab('staff')}
                    >
                        Staff App
                    </Button>
                    <Button
                        variant={activeTab === 'mobile' ? 'black' : 'secondary'}
                        onClick={() => setActiveTab('mobile')}
                    >
                        Mobile App
                    </Button>

                </div>
            </div>

            {activeTab === 'staff' && (
                <div>
                    <Card title='Staff Permission' className="max-w-4xl mx-auto mt-8">
                        <div className="grid grid-cols-1 gap-8 items-center">
                            <div className="space-y-6 text-lg">
                                {[
                                    { key: 'billing', label: 'Billing' },
                                    { key: 'ProductsInsight', label: 'Product Insight' },
                                    { key: 'Inventory', label: 'Inventory' },
                                    { key: 'Expenditure', label: 'Expenditure' },
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
                                                checked={staffFormData[item.key] || false}
                                                disabled={!isEditing}
                                                onChange={(e) =>
                                                    setStaffFormData((prev) => ({
                                                        ...prev,
                                                        [item.key]: e.target.checked
                                                    }))
                                                }
                                            />
                                            {/* Track with red/green color */}
                                            <div
                                                className={`w-11 h-6 rounded-full transition-colors duration-200 ${staffFormData[item.key] ? 'bg-green-500' : 'bg-red-500'
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
            )}

            {activeTab === 'mobile' && (
                <div>
                    <Card title='Mobile App  Permission' className="max-w-4xl mx-auto mt-8">
                        <div className="grid grid-cols-1 gap-8 items-center">
                            <div className="space-y-6 text-lg">
                                {[
                                    { key: 'Wallet', label: 'Wallet' },
                                    { key: 'Wallet UPI', label: 'Wallet &  UPI' },
                                    { key: 'UPI', label: 'UPI' },
                                    { key: 'Pre Order', label: 'Pre Order' },
                                    { key: 'Discounts / Offer', label: 'Discounts / Offer' },
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
                                                checked={mobileFormData[item.key] || false}
                                                disabled={!isEditing}
                                                onChange={(e) =>
                                                    setMobileFormData((prev) => ({
                                                        ...prev,
                                                        [item.key]: e.target.checked
                                                    }))
                                                }
                                            />
                                            {/* Track with red/green color */}
                                            <div
                                                className={`w-11 h-6 rounded-full transition-colors duration-200 ${mobileFormData[item.key] ? 'bg-green-500' : 'bg-red-500'
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
            )}
        </div>
    )
}

export default AppManagement