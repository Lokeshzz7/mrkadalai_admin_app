import React, { useState } from 'react'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const Ticket = () => {

    const [searchQuery, setSearchQuery] = useState('')

    const ticketsData = [
        {
            ticketId: '#TCK001',
            date: '2025-06-01',
            description: 'Unable to login to account',
            raisedBy: 'John Doe',
            priority: 'high',
            status: 'open',
            action: <Button>View</Button>
        },
        {
            ticketId: '#TCK002',
            date: '2025-06-02',
            description: 'Payment not reflected in wallet',
            raisedBy: 'Jane Smith',
            priority: 'medium',
            status: 'closed',
            action: <Button>View</Button>
        },
        {
            ticketId: '#TCK003',
            date: '2025-06-03',
            description: 'App crashing on launch',
            raisedBy: 'Charlie Brown',
            priority: 'high',
            status: 'open',
            action: <Button>View</Button>
        },
        {
            ticketId: '#TCK004',
            date: '2025-06-04',
            description: 'Unable to update profile information',
            raisedBy: 'Diana Prince',
            priority: 'low',
            status: 'closed',
            action: <Button>View</Button>
        },
        {
            ticketId: '#TCK005',
            date: '2025-06-05',
            description: 'Order not delivered',
            raisedBy: 'Bruce Wayne',
            priority: 'medium',
            status: 'open',
            action: <Button>View</Button>
        }
    ]

    const filteredTickets = ticketsData.filter(ticket => ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) || ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) || ticket.raisedBy.toLowerCase().includes(searchQuery.toLowerCase()))

    const searchTicketData = filteredTickets.map(ticket => [
        ticket.ticketId,
        ticket.date,
        ticket.description,
        ticket.raisedBy,
        <Badge
            variant={ticket.priority}
        >
            {ticket.priority}
        </Badge >,
        <Badge
            variant={ticket.status}
        >
            {ticket.status}
        </Badge >,
        <Button>
            View
        </Button>
    ])

    return (
        <div className='space-y-6'>
            <h1 className='text-4xl font-bold'>Ticket Management</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
                <Card Black>
                    <p className="text-gray-600">Total tickets</p>
                    <h2 className="text-2xl font-bold text-blue-600">45</h2>
                </Card>
                <Card Black>
                    <p className="text-gray-600">Open Tickets</p>
                    <h2 className="text-2xl font-bold text-blue-600">45</h2>
                </Card>
                <Card Black>
                    <p className="text-gray-600">Closed Ticket</p>
                    <h2 className="text-2xl font-bold text-blue-600">45</h2>
                </Card>
                <Card Black>
                    <p className="text-gray-600">Avg Resolution Time</p>
                    <h2 className="text-2xl font-bold text-blue-600">45</h2>
                </Card>


            </div>

        <div className='flex justify-between items-center mb-4 flex-wrap gap-2'>
            <h2 className="text-lg font-semibold text-gray-800">Ticket Details</h2>
            <input
                type='text'
                placeholder='Search by Id or description or name'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='border rounded p-2 w-64'
            />
        </div>
        <Card>
            <Table
                headers={['Ticket Id', 'Date', 'Ticket Description', 'Ticket Raised by', 'Priority', 'Status', 'Actions']}
                data={searchTicketData}
            />
        </Card>
        </div>
    )
}

export default Ticket