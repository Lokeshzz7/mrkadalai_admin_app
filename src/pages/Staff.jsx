import React, { useState, useEffect } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Briefcase } from 'lucide-react';
import { apiRequest } from '../utils/api';

const Staff = () => {
    const navigate = useNavigate()
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const outletId = localStorage.getItem('outletId');

    useEffect(() => {
        fetchStaffList();
    }, []);

    const fetchStaffList = async () => {
        try {
            setLoading(true);
            const response = await apiRequest(`/superadmin/outlets/get-staffs/${outletId}`);
            console.log(response);
            setStaffList(response.staffs || []);
        } catch (err) {
            setError('Failed to fetch staff list');
            console.error('Error fetching staff:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading staff...</div>
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
            {/* Heading + Add Button */}
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">Staff Details</h1>
                <Button variant='success' onClick={() => navigate('/staff/add')}>
                    Add Staff
                </Button>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {staffList.map((staff) => (
                    <Card
                        key={staff.id}
                        title=""
                        className="cursor-pointer"
                        onClick={() => navigate(`/staff/${staff.id}`)}
                    >
                        <div className="flex">
                            {/* Left: Image - Using placeholder since image field is removed */}
                            <div className="w-1/3">
                                <div className="h-full w-full bg-gray-200 rounded-l-lg flex items-center justify-center">
                                    <User className="w-12 h-12 text-gray-400" />
                                </div>
                            </div>

                            {/* Right: Staff Info */}
                            <div className="w-2/3 p-4 space-y-2 text-sm">
                                <p className="flex items-center gap-2 font-bold text-lg">
                                    <User className="w-4 h-4 text-gray-700" />
                                    {staff.user?.name || 'N/A'}
                                </p>
                                <p className="flex items-center gap-2 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    {staff.user?.email || 'N/A'}
                                </p>
                                <p className="flex items-center gap-2 text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    {staff.user?.phone || 'N/A'}
                                </p>
                                <p className="flex items-center gap-2 text-gray-500 italic">
                                    <Briefcase className="w-4 h-4" />
                                    {staff.staffRole || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {staffList.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No staff members found</p>
                </div>
            )}
        </div>
    )
}

export default Staff