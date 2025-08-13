import React, { useState, useEffect } from 'react'
import Button from '../components/ui/Button.jsx';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card.jsx';
import { apiRequest } from '../utils/api.js'; 
import toast from 'react-hot-toast';

const AppManagement = () => {
    const [activeTab, setActiveTab] = useState('mobile');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    
    const outletId = localStorage.getItem('outletId');
    
    const [mobileFormData, setMobileFormData] = useState({
        APP: false,
        UPI: false,
        LIVE_COUNTER: false,
        COUPONS: false
    });

    const [preorderFormData, setPreorderFormData] = useState({
        // Add any preorder specific toggles here if needed in the future
    });

    const navigate = useNavigate();

    const allSlots = [
        "SLOT_11_12",
        "SLOT_12_13", 
        "SLOT_13_14",
        "SLOT_14_15",
        "SLOT_15_16",
        "SLOT_16_17"
    ];

    const clearSelectedDates = () => {
        setSelectedDates([]);
    };

    useEffect(() => {
        if (outletId) {
            if (activeTab === 'mobile') {
                fetchMobileAppFeatures();
            } else if (activeTab === 'preorder') {
                fetchNonAvailabilityData();
            }
        }
    }, [activeTab, outletId]);

    const fetchMobileAppFeatures = async () => {
        try {
            setLoading(true);
            
            const response = await apiRequest(`/superadmin/outlets/app-features/${outletId}`, {
                method: 'GET'
            });

            if (response && response.data) {
                setMobileFormData(response.data);
            }
        } catch (error) {
            console.error('Error fetching mobile app features:', error);
            toast.error('Failed to load mobile app features: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const saveMobileAppFeatures = async () => {
        try {
            setLoading(true);

            const features = Object.keys(mobileFormData).map(key => ({
                feature: key,
                isEnabled: mobileFormData[key]
            }));

            const response = await apiRequest('/superadmin/outlets/app-features/', {
                method: 'POST',
                body: {
                    outletId: parseInt(outletId),
                    features: features
                }
            });

            if (response) {
                toast.success('Mobile app features updated successfully!');
            }
        } catch (error) {
            console.error('Error saving mobile app features:', error);
            toast.error('Failed to save mobile app features: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchNonAvailabilityData = async () => {
        try {
            setLoading(true);
            
            const response = await apiRequest(`/superadmin/outlets/get-non-availability-preview/${outletId}`, {
                method: 'GET'
            });

            if (response && response.data) {
                const nonAvailableDates = response.data.map(entry => entry.date);
                setSelectedDates(nonAvailableDates);
            }
        } catch (error) {
            console.error('Error fetching non-availability data:', error);
            toast.error('Failed to load non-availability data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const saveNonAvailabilityData = async () => {
        try {
            setLoading(true);

            const nonAvailableDates = selectedDates.map(date => ({
                date: date,
                nonAvailableSlots: [...allSlots]
            }));

            const response = await apiRequest('/superadmin/outlets/set-availability/', {
                method: 'POST',
                body: {
                    outletId: outletId,
                    nonAvailableDates: nonAvailableDates
                }
            });

            if (response) {
                toast.success('Non-availability dates updated successfully!');
            }
        } catch (error) {
            console.error('Error saving non-availability data:', error);
            toast.error('Failed to save non-availability data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleEdit = async () => {
        if (isEditing) {
            if (activeTab === 'mobile') {
                console.log("Saving mobile data:", mobileFormData);
                await saveMobileAppFeatures();
            } else if (activeTab === 'preorder') {
                console.log("Saving preorder data - Selected non-available dates:", selectedDates);
                await saveNonAvailabilityData();
            }
        }
        setIsEditing(!isEditing);
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const isDateSelected = (date) => {
        const dateStr = formatDate(date);
        return selectedDates.includes(dateStr);
    };

    const handleDateClick = (day) => {
        if (!isEditing || loading) return;

        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        clickedDate.setHours(0, 0, 0, 0);

        if (clickedDate < today) {
            return;
        }

        const dateStr = formatDate(clickedDate);

        setSelectedDates(prev => {
            if (prev.includes(dateStr)) {
                return prev.filter(date => date !== dateStr);
            } else {
                return [...prev, dateStr];
            }
        });
    };

    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        const days = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isSelected = isDateSelected(date);
            const isToday = new Date().toDateString() === date.toDateString();
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dayDate = new Date(date);
            dayDate.setHours(0, 0, 0, 0);
            const isPastDate = dayDate < today;

            let dayClasses = "h-10 flex items-center justify-center text-sm rounded-lg transition-all duration-200";

            if (isEditing && !loading && !isPastDate) {
                dayClasses += " cursor-pointer hover:bg-gray-100";
            } else {
                dayClasses += " cursor-not-allowed";
            }

            if (isPastDate) {
                dayClasses += " bg-gray-100 text-gray-400 cursor-not-allowed";
            } else if (isSelected) {
                dayClasses += " bg-red-500 text-white font-semibold";
                if (isEditing && !loading) {
                    dayClasses += " hover:bg-red-600";
                }
            } else {
                dayClasses += " bg-white text-gray-700";
                if (!isEditing || loading) {
                    dayClasses += " text-gray-400";
                }
            }

            if (isToday && !isSelected && !isPastDate) {
                dayClasses += " border-2 border-blue-500";
            } else {
                dayClasses += " border border-gray-200";
            }

            days.push(
                <div
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={dayClasses}
                >
                    {day}
                </div>
            );
        }

        return (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-600 cursor-pointer"
                        disabled={loading}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <h3 className="text-lg font-semibold text-gray-800">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>

                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-600 cursor-pointer"
                        disabled={loading}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map(day => (
                        <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days}
                </div>

                {loading && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">Loading...</p>
                    </div>
                )}

                {selectedDates.length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-red-700">
                                Non-Available Dates ({selectedDates.length}):
                            </p>
                            {isEditing && !loading && (
                                <button
                                    onClick={clearSelectedDates}
                                    className="text-xs text-red-600 hover:text-red-800 underline"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {selectedDates.sort().map(date => (
                                <span
                                    key={date}
                                    className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                                >
                                    {new Date(date + 'T00:00:00').toLocaleDateString()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">
                        Select dates that should be marked as non-available (red dates). Past dates cannot be selected. All time slots will be marked as unavailable for selected dates.
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className='space-y-6'>
            <h1 className='text-4xl font-bold'>App Management</h1>

            <div className="flex justify-between items-center">
                <div className='flex space-x-4'>
                    <Button
                        variant={activeTab === 'mobile' ? 'black' : 'secondary'}
                        onClick={() => setActiveTab('mobile')}
                        disabled={loading}
                    >
                        Mobile App
                    </Button>
                    <Button
                        variant={activeTab === 'preorder' ? 'black' : 'secondary'}
                        onClick={() => setActiveTab('preorder')}
                        disabled={loading}
                    >
                        Preorder Settings
                    </Button>
                </div>
            </div>

            {activeTab === 'mobile' && (
                <div>
                    <Card title='Mobile App Permission' className="max-w-4xl mx-auto mt-8">
                        <div className="grid grid-cols-1 gap-8 items-center">
                            <div className="space-y-6 text-lg">
                                {[
                                    { key: 'APP', label: 'App' },
                                    { key: 'UPI', label: 'UPI' },
                                    { key: 'LIVE_COUNTER', label: 'Live Counter' },
                                    { key: 'COUPONS', label: 'Coupons' },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between">
                                        <span>{item.label}</span>
                                        <label className={`relative inline-flex items-center ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
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
                                            <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${mobileFormData[item.key] ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all peer-checked:translate-x-full"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <Button 
                                variant={isEditing ? "success" : "primary"} 
                                onClick={handleToggleEdit}
                                disabled={loading}
                            >
                                {loading ? "Loading..." : (isEditing ? "Save Details" : "Update Details")}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'preorder' && (
                <Card title='Preorder Settings - Non-Availability Management' className="max-w-4xl mx-auto mt-8">

                    {renderCalendar()}

                    <div className="flex justify-end mt-6">
                        <Button 
                            variant={isEditing ? "success" : "primary"} 
                            onClick={handleToggleEdit}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : (isEditing ? "Save Details" : "Update Details")}
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    )
}

export default AppManagement