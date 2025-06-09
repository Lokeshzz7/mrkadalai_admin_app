import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const PERMISSIONS_LIST = [
  { key: 'billing', label: 'Billing' },
  { key: 'ProductsInsight', label: 'Product Insight' },
  { key: 'Inventory', label: 'Inventory' },
  { key: 'Reports', label: 'Reports' },
];

const AddStaff = () => {
  const navigate = useNavigate();
  const [editPermissions, setEditPermissions] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    username: '',
    password: '',
    confirmPassword: '',
    permissions: [],
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const togglePermission = (key) => {
    setFormData(prev => {
      const exists = prev.permissions.includes(key);
      const newPermissions = exists
        ? prev.permissions.filter(p => p !== key)
        : [...prev.permissions, key];
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleCreateAccount = () => {
    console.log('Creating account with data:', formData);
    // Add your submission logic here
  };

  return (
    <div className="space-y-6">
      {/* Back & Heading */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full bg-gray-200 hover:bg-gray-300 p-2"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black">
            <polygon points="15,5 7,12 15,19" />
          </svg>
        </button>
        <h1 className="text-3xl font-bold">Create Staff Account</h1>
      </div>

      <Card className="max-w-5xl mx-auto space-y-6 p-6">
        {/* Image Upload & Full Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Upload Image</label>
            <div className="flex items-center space-x-4">
              {formData.image && (
                <img src={formData.image} alt="Staff" className="w-12 h-12 rounded-full object-cover" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border rounded text-sm text-gray-600 bg-gray-100 mb-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100 mb-2"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100 mb-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100 mb-2"
            />
          </div>
        </div>

        {/* Role & Username */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Role</label>
            <input
              type="text"
              name="role"
              placeholder="Enter role (e.g. Manager)"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100 mb-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100 mb-2"
            />
          </div>
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100 mb-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100 mb-2"
            />
          </div>
        </div>

        {/* Permissions Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>

          {!editPermissions ? (
            <div className="flex items-center gap-3">
              <input
                type="text"
                value="Default Permissions"
                disabled
                className="w-60 p-2 border rounded bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <Button variant="black" onClick={() => setEditPermissions(true)}>
                Edit Permissions
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between flex-wrap gap-4">
              {PERMISSIONS_LIST.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between bg-gray-100 rounded-lg p-3 w-[180px]">
                  <span className="text-sm font-medium">{label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(key)}
                      onChange={() => togglePermission(key)}
                      className="sr-only peer"
                    />
                              <div
    className="w-10 h-5 rounded-full transition-colors duration-200 bg-black peer-checked:bg-theme"
  ></div>
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white border border-gray-300 rounded-full shadow transform peer-checked:translate-x-full transition duration-200 ease-in-out" />
                  </label>
                </div>
              ))}
              <Button variant="black" onClick={() => setEditPermissions(false)}>
                Save
              </Button>
            </div>
          )}
        </div>

        {/* Create Button */}
        <div className="flex justify-end pt-4">
          <Button variant="black" onClick={handleCreateAccount}>
            Create Account
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AddStaff;
