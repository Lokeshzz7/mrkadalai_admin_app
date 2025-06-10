import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const Ticket = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTicketForView, setSelectedTicketForView] = useState(null);

  const [selectedTicketForChat, setSelectedTicketForChat] = useState(null);
  const [chatReplies, setChatReplies] = useState({});
  const [chatInput, setChatInput] = useState('');
  const ticketsData = [
    {
      ticketId: '#TCK001',
      date: '2025-06-01',
      description: 'Unable to login to account',
      raisedBy: 'John Doe',
      priority: 'high',
      status: 'open'
    },
    {
      ticketId: '#TCK002',
      date: '2025-06-02',
      description: 'Payment not reflected in wallet',
      raisedBy: 'Jane Smith',
      priority: 'medium',
      status: 'closed'
    },
    {
      ticketId: '#TCK003',
      date: '2025-06-03',
      description: 'App crashing on launch',
      raisedBy: 'Charlie Brown',
      priority: 'high',
      status: 'open'
    },
    {
      ticketId: '#TCK004',
      date: '2025-06-04',
      description: 'Unable to update profile information',
      raisedBy: 'Diana Prince',
      priority: 'low',
      status: 'closed'
    },
    {
      ticketId: '#TCK005',
      date: '2025-06-05',
      description: 'Order not delivered',
      raisedBy: 'Bruce Wayne',
      priority: 'medium',
      status: 'open'
    }
  ];

  // Filter tickets based on search query
  const filteredTickets = ticketsData.filter(ticket =>
    ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.raisedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Map tickets data for the table with two action buttons (View & Chat)
  const searchTicketData = filteredTickets.map(ticket => [
    ticket.ticketId,
    ticket.date,
    ticket.description,
    ticket.raisedBy,
    <Badge variant={ticket.priority} key={`${ticket.ticketId}-priority`}>
      {ticket.priority}
    </Badge>,
    <Badge variant={ticket.status} key={`${ticket.ticketId}-status`}>
      {ticket.status}
    </Badge>,
    <div className="flex space-x-2" key={ticket.ticketId}>
      <Button
        onClick={() => {
          setSelectedTicketForView(ticket);
          setShowViewModal(true);
        }}
      >
        View
      </Button>
      <Button
        onClick={() => {
          setSelectedTicketForChat(ticket);
          setChatInput(chatReplies[ticket.ticketId] || '');
        }}
      >
        Chat
      </Button>
    </div>
  ]);

  const closeViewModal = () => {
    setSelectedTicketForView(null);
    setShowViewModal(false);
  };

  const closeChatModal = () => {
    setSelectedTicketForChat(null);
    setChatInput('');
  };

  const sendChatReply = () => {
    if (chatInput.trim() !== '') {
      setChatReplies(prev => ({ ...prev, [selectedTicketForChat.ticketId]: chatInput.trim() }));
      selectedTicketForChat.status = 'closed';
      setSelectedTicketForChat({ ...selectedTicketForChat });
      setChatInput('');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Ticket Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card Black>
          <p className="text-gray-600">Total tickets</p>
          <h2 className="text-2xl font-bold text-blue-600">45</h2>
        </Card>
        <Card Black>
          <p className="text-gray-600">Open Tickets</p>
          <h2 className="text-2xl font-bold text-blue-600">45</h2>
        </Card>
        <Card Black>
          <p className="text-gray-600">Closed Tickets</p>
          <h2 className="text-2xl font-bold text-blue-600">45</h2>
        </Card>
        <Card Black>
          <p className="text-gray-600">Avg Resolution Time</p>
          <h2 className="text-2xl font-bold text-blue-600">45</h2>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-gray-800">Ticket Details</h2>
        <input
          type="text"
          placeholder="Search by Id, description or name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded p-2 w-64"
        />
      </div>
      <Card>
        <Table
          headers={[
            'Ticket Id',
            'Date',
            'Ticket Description',
            'Ticket Raised by',
            'Priority',
            'Status',
            'Actions'
          ]}
          data={searchTicketData}
        />
      </Card>

      {/* View Modal */}
      {showViewModal && selectedTicketForView && (
        <Modal
          isOpen={true}
          onClose={closeViewModal}
          title={`Ticket Details: ${selectedTicketForView.ticketId}`}
          footer={<Button onClick={closeViewModal}>Close</Button>}
        >
          <div className="space-y-2">
            <p><strong>Date:</strong> {selectedTicketForView.date}</p>
            <p><strong>Description:</strong> {selectedTicketForView.description}</p>
            <p><strong>Raised By:</strong> {selectedTicketForView.raisedBy}</p>
            <p><strong>Priority:</strong> {selectedTicketForView.priority}</p>
            <p><strong>Status:</strong> {selectedTicketForView.status}</p>
          </div>
        </Modal>
      )}

      {/* Chat Modal */}
      {selectedTicketForChat && (
  <Modal
    isOpen={true}
    onClose={closeChatModal}
    title={`Chat: ${selectedTicketForChat.ticketId}`}
    footer={
      selectedTicketForChat.status === 'open' && !chatReplies[selectedTicketForChat.ticketId] ? (
        <Button onClick={sendChatReply}>Send</Button>
      ) : (
        <Button onClick={closeChatModal}>Close</Button>
      )
    }
  >
    <div className="h-96 flex flex-col border rounded-lg overflow-hidden">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {/* Customer message */}
        <div className="flex">
          <div className="bg-white px-4 py-2 rounded-lg shadow text-gray-800 max-w-xs">
            <p className="text-sm">{selectedTicketForChat.description}</p>
            <p className="text-xs text-right text-gray-400 mt-1">Customer</p>
          </div>
        </div>

        {/* Admin reply if exists */}
        {chatReplies[selectedTicketForChat.ticketId] && (
          <div className="flex justify-end">
            <div className="bg-green-100 px-4 py-2 rounded-lg shadow text-gray-900 max-w-xs">
              <p className="text-sm">{chatReplies[selectedTicketForChat.ticketId]}</p>
              <p className="text-xs text-right text-gray-600 mt-1">You</p>
            </div>
          </div>
        )}
      </div>

      {/* Input box (only if admin can reply) */}
      {selectedTicketForChat.status === 'open' &&
        !chatReplies[selectedTicketForChat.ticketId] && (
          <div className="border-t p-3 bg-white">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-100"
            />
          </div>
        )}
    </div>
  </Modal>
)}

    </div>
  );
};

export default Ticket;
