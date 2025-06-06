import React, { useState } from 'react';
import Button from '../components/ui/Button';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    designation: 'Manager',
    phone: '+91-9876543210',
  };

  return (
    <div className="p-6 space-y-8">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>

      {/* Tabs */}
      <div className="flex space-x-8 border-b border-gray-300 pb-2">
        {['profile', 'notifications', 'security'].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer pb-1 text-lg capitalize ${
              activeTab === tab
                ? 'border-b-4 border-theme font-semibold text-theme'
                : 'text-black hover:text-theme'
            }`}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Profile</h3>

          {/* Profile Picture Row */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full border border-gray-400" />
            <Button variant="primary">Upload</Button>
            <Button variant="danger">Delete</Button>
          </div>

          {/* Information Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              {/* Name and Email */}
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                />
              </div>

              {/* Designation and Phone */}
              <div>
                <label className="text-sm text-gray-600">Designation</label>
                <input
                  type="text"
                  value={user.designation}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <input
                  type="text"
                  value={user.phone}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-x-4">
            <Button variant="secondary">Edit Profile</Button>
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Notifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Side Text */}
            <div className="space-y-6 text-gray-700 text-base">
              <p>Enable or disable notifications to stay updated on important events and alerts.</p>
              <p>You can toggle alerts for orders, inventory, and refund updates.</p>
              <p>Customize which notifications you want to receive in real-time.</p>
            </div>

            {/* Right Side Toggles */}
            <div className="space-y-6 text-lg">
              <div className="flex items-center justify-between">
                <span>Order Alerts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all"></div>
                <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all peer-checked:translate-x-full"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span>Inventory Low Stock Alerts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all"></div>
                <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all peer-checked:translate-x-full"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span>Refund & Cancellation Alerts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all"></div>
                <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all peer-checked:translate-x-full"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Change Password</h3>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="text-sm text-gray-600">Old Password</label>
              <input
                type="password"
                value="********"
                disabled
                className="w-full p-2 border border-gray-300 rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">New Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Confirm New Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <Button variant="primary">Update Password</Button>
          </div>

          {/* 2FA Section */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center justify-between max-w-md">
              <span className="text-lg text-gray-700 font-medium">Enable 2-Factor Authentication</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all"></div>
                <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all peer-checked:translate-x-full"></div>
                </label>
            </div>
            <div>
              <img
                src="/images/qr-placeholder.png" 
                alt="QR Code"
                className="w-40 h-40"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
