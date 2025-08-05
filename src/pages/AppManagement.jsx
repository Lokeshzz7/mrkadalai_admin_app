import React, { useState, useEffect } from 'react'
import Button from '../components/ui/Button.jsx';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card.jsx';

const AppManagement = () => {
    const [activeTab, setActiveTab] = useState('mobile');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    const [mobileFormData, setMobileFormData] = useState({
        App: false,
        UPI: false,
        'Live Counter': false,
        Coupons: false
    });

    const [preorderFormData, setPreorderFormData] = useState({
        // Add any preorder specific toggles here if needed in the future
    });

    const navigate = useNavigate();

    // Function to clear all selected dates
    const clearSelectedDates = () => {
        setSelectedDates([]);
        localStorage.removeItem('selectedCalendarDates');
    };

    // Load selected dates from localStorage on component mount
    useEffect(() => {
        const savedDates = localStorage.getItem('selectedCalendarDates');
        if (savedDates) {
            try {
                const parsedDates = JSON.parse(savedDates);
                if (Array.isArray(parsedDates)) {
                    setSelectedDates(parsedDates);
                }
            } catch (error) {
                console.error('Error parsing saved dates:', error);
                localStorage.removeItem('selectedCalendarDates');
            }
        }
    }, []);

    // Save selected dates to localStorage whenever selectedDates changes
    useEffect(() => {
        if (selectedDates.length > 0) {
            localStorage.setItem('selectedCalendarDates', JSON.stringify(selectedDates));
        }
    }, [selectedDates]);

    const handleToggleEdit = () => {
        if (isEditing) {
            console.log("Saving data:", activeTab === 'mobile' ? mobileFormData : preorderFormData);
            console.log("Selected dates:", selectedDates);

            if (selectedDates.length > 0) {
                localStorage.setItem('selectedCalendarDates', JSON.stringify(selectedDates));
                console.log("Dates saved to localStorage:", selectedDates);
            }
        }
        setIsEditing(!isEditing);
    };

    // Calendar helper functions
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
        if (!isEditing) return;

        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateStr = formatDate(clickedDate);

        setSelectedDates(prev => {
            let newDates;
            if (prev.includes(dateStr)) {
                newDates = prev.filter(date => date !== dateStr);
            } else {
                newDates = [...prev, dateStr];
            }

            if (newDates.length > 0) {
                localStorage.setItem('selectedCalendarDates', JSON.stringify(newDates));
            } else {
                localStorage.removeItem('selectedCalendarDates');
            }

            return newDates;
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

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isSelected = isDateSelected(date);
            const isToday = new Date().toDateString() === date.toDateString();

            let dayClasses = "h-10 flex items-center justify-center text-sm rounded-lg transition-all duration-200";

            if (isEditing) {
                dayClasses += " cursor-pointer hover:bg-gray-100";
            } else {
                dayClasses += " cursor-not-allowed";
            }

            if (isSelected) {
                dayClasses += " bg-green-500 text-white font-semibold";
                if (isEditing) {
                    dayClasses += " hover:bg-green-600";
                }
            } else {
                dayClasses += " bg-white text-gray-700";
                if (!isEditing) {
                    dayClasses += " text-gray-400";
                }
            }

            if (isToday && !isSelected) {
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
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2 ">
                    {dayNames.map(day => (
                        <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days}
                </div>

                {selectedDates.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-700">
                                Selected Dates ({selectedDates.length}):
                            </p>
                            {isEditing && (
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
                                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                                >
                                    {new Date(date + 'T00:00:00').toLocaleDateString()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className='space-y-6'>
            <h1 className='text-4xl font-bold'>App Management </h1>

            <div className="flex justify-between items-center">
                <div className='flex space-x-4'>
                    <Button
                        variant={activeTab === 'mobile' ? 'black' : 'secondary'}
                        onClick={() => setActiveTab('mobile')}
                    >
                        Mobile App
                    </Button>
                    <Button
                        variant={activeTab === 'preorder' ? 'black' : 'secondary'}
                        onClick={() => setActiveTab('preorder')}
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
                                    { key: 'App', label: 'App' },
                                    { key: 'UPI', label: 'UPI' },
                                    { key: 'Live Counter', label: 'Live Counter' },
                                    { key: 'Coupons', label: 'Coupons' },
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
                            <Button variant={isEditing ? "success" : "primary"} onClick={handleToggleEdit}>
                                {isEditing ? "Save Details" : "Update Details"}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'preorder' && (
                <div>
                    <Card title='Preorder Settings' className="max-w-4xl mx-auto mt-8">
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Select Available Dates</h3>
                            {renderCalendar()}
                        </div>

                        <div className="flex justify-end mt-6">
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