import React from 'react'
import Card from '../components/ui/Card'
import staff from '../assets/staff.jpg'
import { Navigate, useNavigate } from 'react-router-dom';
import { staffList } from '../data/staffData';

const Staff = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold">Staff Details</h1>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>

                {staffList.map((staff) => (
                    <Card
                        Black
                        title={staff.name}
                        key={staff.id}
                        className='cursor-pointer'
                        onClick={() => navigate(`/staff/${staff.id}`)}                    >
                        <div className="flex rounded-lg overflow-hidden mb-4">
                            {/* Left - Image */}
                            <div className="w-1/3">
                                <img src={staff.image} alt={staff.name} className="h-full w-full object-cover " />
                            </div>

                            {/* Right - Details */}
                            <div className="w-2/3 p-4 text-sm font-bold">
                                <p className="text-gray-600">{staff.position}</p>
                                <p className="text-gray-500">{staff.email}</p>
                                <p className="text-gray-500">{staff.number}</p>
                            </div>
                        </div>

                    </Card>
                ))}



            </div>
        </div>
    )
}

export default Staff