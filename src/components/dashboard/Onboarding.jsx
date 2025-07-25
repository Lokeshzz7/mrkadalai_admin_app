import React, { useState, useEffect } from 'react'
import Card from '../ui/Card';
import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Briefcase } from 'lucide-react';
import { apiRequest } from '../../utils/api';

const Onboarding = () => {
    const navigate = useNavigate()
    const [adminList, setadminList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // const outletId = localStorage.getItem('outletId');

    useEffect(() => {
        fetchadminList();
    }, []);

    const fetchadminList = async () => {
        try {
            setLoading(true);
            const response = await apiRequest('/superadmin/pending-admins');
            console.log(response);
            setadminList(response);
        } catch (err) {
            setError('Failed to fetch admin list');
            console.error('Error fetching admin:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading admin...</div>
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
                <h1 className="text-4xl font-bold">Admin Details</h1>

            </div>

            {/* admin Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {adminList.map((admin) => (
                    <Card
                        key={admin.id}
                        title=""
                        className="cursor-pointer"
                        onClick={() => navigate(`/admin/${admin.id}`)}
                    >
                        <div className="flex">

                            <div className="w-1/3">
                                <div className="h-full w-full bg-gray-200 rounded-l-lg flex items-center justify-center">
                                    <User className="w-12 h-12 text-gray-400" />
                                </div>
                            </div>

                            {/* Right: admin Info */}
                            <div className="w-2/3 p-4 space-y-2 text-sm">
                                <p className="flex items-center gap-2 font-bold text-lg">
                                    <User className="w-4 h-4 text-gray-700" />

                                    {admin.name || 'N/A'}
                                </p>
                                <p className="flex items-center gap-2 text-gray-600">
                                    <Mail className="w-4 h-4 text-gray-700 shrink-0" />
                                    {admin.email || 'N/A'}
                                </p>

                                <p className="flex items-center gap-2 text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    {admin.phone || 'N/A'}
                                </p>
                                <p className="flex items-center gap-2 text-gray-600 ">
                                    <Briefcase className="w-4 h-4" />
                                    admin
                                </p>

                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {
                adminList.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No admin members found</p>
                    </div>
                )
            }
        </div >
    )
}

export default Onboarding