import React, { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Modal from '../components/ui/Modal'

const Customer = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const customersData = [
    {
      customerId: 'CUST001',
      walletId: 'WALLET001',
      name: 'Alice Johnson',
      year: '2022',
      phoneNumber: '9876543210',
      email: 'alice@example.com',
      walletBalance: '₹12,500',
      totalOrders: 15,
      totalPurchase: '₹45,000',
      lastOrderDate: '2025-06-08',
    },
    {
      customerId: 'CUST002',
      walletId: 'WALLET002',
      name: 'Bob Smith',
      year: '2023',
      phoneNumber: '9123456780',
      email: 'bob@example.com',
      walletBalance: '₹5,750',
      totalOrders: 7,
      totalPurchase: '₹22,300',
      lastOrderDate: '2025-06-05',
    },
    {
      customerId: 'CUST001',
      walletId: 'WALLET001',
      name: 'Alice Johnson',
      year: '2022',
      phoneNumber: '9876543210',
      email: 'alice@example.com',
      walletBalance: '₹12,500',
      totalOrders: 15,
      totalPurchase: '₹45,000',
      lastOrderDate: '2025-06-08',
    },
    {
      customerId: 'CUST002',
      walletId: 'WALLET002',
      name: 'Bob Smith',
      year: '2023',
      phoneNumber: '9123456780',
      email: 'bob@example.com',
      walletBalance: '₹5,750',
      totalOrders: 7,
      totalPurchase: '₹22,300',
      lastOrderDate: '2025-06-05',
    },
    
    // ... other customers
  ]

  const filteredCustomers = customersData.filter(
    (customer) =>
      customer.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.walletId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const tableData = filteredCustomers.map((c) => [
    c.customerId,
    c.walletId,
    c.name,
    c.year,
    c.phoneNumber,
    c.walletBalance,
    c.totalPurchase,
    <Button
      key={c.customerId}
      onClick={() => {
        setSelectedCustomer(c)
        setShowDetailsModal(true)
      }}
    >
      View
    </Button>,
  ])

  const handleCloseModal = () => {
    setShowDetailsModal(false)
    setSelectedCustomer(null)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Customers Management</h1>

      {/* Search and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Customer Details</h2>
        <input
          type="text"
          placeholder="Search by ID or Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-black px-3 py-2 rounded w-full sm:w-80 mt-2 sm:mt-0"
        />
      </div>

      <Card Black>
        <Table
          headers={[
            'Customer Id',
            'Wallet Id',
            'Name',
            'Year',
            'Phone Number',
            'Wallet Balance',
            'Total purchase',
            'Actions',
          ]}
          data={tableData}
        />
      </Card>

      {/* Modal for Customer Details */}
      <Modal
        isOpen={showDetailsModal}
        onClose={handleCloseModal}
        title={`Customer: ${selectedCustomer?.name}`}
        footer={
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        }
      >
        {selectedCustomer && (
          <table className="w-full text-sm border border-gray-300 rounded">
            <tbody>
              <tr>
                <td className="p-2 border border-gray-300 font-semibold">Customer ID</td>
                <td className="p-2 border border-gray-300">{selectedCustomer.customerId}</td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-300 font-semibold">Wallet ID</td>
                <td className="p-2 border border-gray-300">{selectedCustomer.walletId}</td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-300 font-semibold">Year</td>
                <td className="p-2 border border-gray-300">{selectedCustomer.year}</td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-300 font-semibold">Phone Number</td>
                <td className="p-2 border border-gray-300">{selectedCustomer.phoneNumber}</td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-300 font-semibold">Email</td>
                <td className="p-2 border border-gray-300">{selectedCustomer.email}</td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-300 font-semibold">Wallet Balance</td>
                <td className="p-2 border border-gray-300">{selectedCustomer.walletBalance}</td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-300 font-semibold">Total Orders</td>
                <td className="p-2 border border-gray-300">{selectedCustomer.totalOrders}</td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-300 font-semibold">Total Purchase</td>
                <td className="p-2 border border-gray-300">{selectedCustomer.totalPurchase}</td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-300 font-semibold">Last Order Date</td>
                <td className="p-2 border border-gray-300">{selectedCustomer.lastOrderDate}</td>
              </tr>
            </tbody>
          </table>
        )}
      </Modal>
    </div>
  )
}

export default Customer
