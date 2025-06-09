import React from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { staffList } from '../data/staffData'
import { User, Mail, Phone, Briefcase } from 'lucide-react';


const Staff = () => {
    const navigate = useNavigate()

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
                        Black
                        title=""
                        key={staff.id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/staff/${staff.id}`)}
                    >
                        <div className="flex">
                            {/* Left: Image */}
                            <div className="w-1/3">
                                <img
                                    src={staff.image}
                                    alt={staff.name}
                                    className="h-full w-full object-cover rounded-l-lg"
                                />
                            </div>

                            {/* Right: Staff Info */}
                            <div className="w-2/3 p-4 space-y-2 text-sm">
                                <p className="flex items-center gap-2 font-bold text-lg">
                                    <User className="w-4 h-4 text-gray-700" />
                                    {staff.name}
                                </p>
                                <p className="flex items-center gap-2 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    {staff.email}
                                </p>
                                <p className="flex items-center gap-2 text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    {staff.number}
                                </p>
                                <p className="flex items-center gap-2 text-gray-500 italic">
                                    <Briefcase className="w-4 h-4" />
                                    {staff.position}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Staff
