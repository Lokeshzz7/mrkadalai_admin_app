import React, { useState, useEffect } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Briefcase } from 'lucide-react';
import { apiRequest } from '../utils/api';
import Loader from '../components/ui/Loader';

const Staff = () => {
 const navigate = useNavigate()
 const [staffList, setStaffList] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const outletId = localStorage.getItem('outletId');

useEffect(() => {
        if (outletId) {   fetchStaffList();
        }
 }, [outletId]);

 const fetchStaffList = async () => {
 try {
setLoading(true);
const response = await apiRequest(`/superadmin/outlets/get-staffs/${outletId}`);
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
 <Loader/>
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
 {/* <Button variant='success' onClick={() => navigate('/staff/add')}>
                    Add Staff
                </Button> */}
</div>

{/* Staff Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
 {staffList.map((staff) => (
 <Card
 key={staff.id}
title=""
className="cursor-pointer p-0 overflow-hidden"
 onClick={() => navigate(`/staff/${staff.id}`)}
 >
 <div className="flex">
{/* Left: Image */}
<div className="w-1/3 flex-shrink-0 bg-gray-200">
 {staff.user?.imageUrl ? (
                                    <img 
                                        src={staff.user.imageUrl} 
                                        alt={staff.user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <User className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}
 </div>

 {/* Right: Staff Info */}
<div className="w-2/3 p-4 space-y-2 text-sm">
 <p className="flex items-center gap-2 font-bold text-lg truncate" title={staff.user?.name}>
<User className="w-4 h-4 text-gray-700 flex-shrink-0" />
<span className="truncate">{staff.user?.name || 'N/A'}</span>
</p>
<p className="flex items-center gap-2 text-gray-600 truncate" title={staff.user?.email}>
 <Mail className="w-4 h-4 flex-shrink-0" />
<span className="truncate">{staff.user?.email || 'N/A'}</span>
 </p>
<p className="flex items-center gap-2 text-gray-600 truncate" title={staff.user?.phone}>
<Phone className="w-4 h-4 flex-shrink-0" />
 <span className="truncate">{staff.user?.phone || 'N/A'}</span>
 </p>
 <p className="flex items-center gap-2 text-gray-500 italic truncate" title={staff.staffRole}>
<Briefcase className="w-4 h-4 flex-shrink-0" />
<span className="truncate">{staff.staffRole || 'N/A'}</span>
 </p>
 </div>
 </div>
 </Card>
))}
 </div>
{staffList.length === 0 && !loading && (
<div className="text-center py-12">
 <p className="text-gray-500 text-lg">No staff members found</p>
 </div>
            )}
         </div>
     )
}

export default Staff;