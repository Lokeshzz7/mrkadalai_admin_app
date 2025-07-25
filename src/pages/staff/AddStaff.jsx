import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { apiRequest } from '../../utils/api';

const PERMISSIONS_LIST = [
  { key: 'BILLING', label: 'BILLING' },
  { key: 'PRODUCT_INSIGHTS', label: 'PRODUCT' },
  { key: 'REPORTS', label: 'REPORTS' },
  { key: 'INVENTORY', label: 'INVENTORY' },
];

const AddStaff = () => {
  const navigate = useNavigate();
  const [editPermissions, setEditPermissions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    staffRole: '',
    password: '',
    confirmPassword: '',
    permissions: [],
  });

  const outletId = localStorage.getItem('outletId') || 1;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const validateForm = () => {
    const { name, email, phone, staffRole, password, confirmPassword } = formData;

    if (!name.trim()) {
      alert('Please enter full name');
      return false;
    }

    if (!email.trim()) {
      alert('Please enter email address');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address');
      return false;
    }

    if (!phone.trim()) {
      alert('Please enter phone number');
      return false;
    }

    if (!staffRole.trim()) {
      alert('Please enter staff role');
      return false;
    }

    if (!password.trim()) {
      alert('Please enter password');
      return false;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleCreateAccount = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Prepare data for API
      const staffData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        outletId: parseInt(outletId),
        staffRole: formData.staffRole,
        permissions: formData.permissions
      };

      const response = await apiRequest('/superadmin/outlets/add-staff/', {
        method: 'POST',
        body: staffData
      });

      alert('Staff account created successfully!');
      navigate('/staff');

    } catch (error) {
      console.error('Error creating staff account:', error);
      alert(error.message || 'Failed to create staff account');
    } finally {
      setLoading(false);
    }
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
        {/* Full Name - Now taking full width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-100 mb-2"
            required
          />
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
              required
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
              required
            />
          </div>
        </div>

        {/* Staff Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Staff Role</label>
          <input
            type="text"
            name="staffRole"
            placeholder="Enter role (e.g. Manager, Cashier, Sales Associate)"
            value={formData.staffRole}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-100 mb-2"
            required
          />
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100 mb-2"
              required
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
              required
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
                value={formData.permissions.length > 0 ? `${formData.permissions.length} permission(s) selected` : "Default Permissions"}
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

        {/* Selected Permissions Display */}
        {formData.permissions.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg mt-4">
            <p className="text-sm font-medium text-blue-800 mb-2">Selected Permissions:</p>
            <div className="flex flex-wrap gap-2">
              {formData.permissions.map(permission => {
                const permissionLabel = PERMISSIONS_LIST.find(p => p.key === permission)?.label;
                return (
                  <span key={permission} className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">
                    {permissionLabel}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Create Button */}
        <div className="flex justify-end pt-4">
          <Button
            variant="black"
            onClick={handleCreateAccount}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AddStaff;