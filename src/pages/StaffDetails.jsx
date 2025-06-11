import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { User } from 'lucide-react';
import { apiRequest } from '../utils/api';

const StaffDetails = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  // Separate editing states for each tab
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingPermissions, setIsEditingPermissions] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    staffRole: '',
    billing: false,
    productsInsight: false,
    inventory: false,
    reports: false,
  });

  useEffect(() => {
    fetchStaffDetails();
  }, [id]);

  const fetchStaffDetails = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`/admin/outlets/staff/${id}`);
      const staffMember = response.staff;

      if (staffMember) {
        setStaff(staffMember);

        const permissions = {};
        staffMember.permissions?.forEach((perm) => {
          switch (perm.type) {
            case 'BILLING':
              permissions.billing = perm.isGranted;
              break;
            case 'PRODUCT_INSIGHTS':
              permissions.productsInsight = perm.isGranted;
              break;
            case 'INVENTORY':
              permissions.inventory = perm.isGranted;
              break;
            case 'REPORTS':
              permissions.reports = perm.isGranted;
              break;
            default:
              break;
          }
        });

        setFormData({
          name: staffMember.user?.name || '',
          email: staffMember.user?.email || '',
          phone: staffMember.user?.phone || '',
          staffRole: staffMember.staffRole || '',
          billing: permissions.billing || false,
          productsInsight: permissions.productsInsight || false,
          inventory: permissions.inventory || false,
          reports: permissions.reports || false,
        });
      } else {
        setError('Staff member not found');
      }
    } catch (err) {
      setError('Failed to fetch staff details');
      console.error('Error fetching staff details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionChange = (permission, checked) => {
    setFormData((prev) => ({
      ...prev,
      [permission]: checked,
    }));
  };

  // Save staff details only
  const saveStaffDetails = async () => {
    try {
      await apiRequest(`/admin/outlets/update-staff/${staff.id}`, {
        method: 'PUT',
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          staffRole: formData.staffRole,
        },
      });
      alert('Staff details updated successfully');
      setIsEditingDetails(false);
      await fetchStaffDetails();
    } catch (err) {
      console.error('Error saving staff details:', err);
      alert('Failed to save staff details');
    }
  };

  // Save permissions only
  const savePermissions = async () => {
    try {
      const permissionTypeMap = {
        billing: 'BILLING',
        productsInsight: 'PRODUCT_INSIGHTS',
        inventory: 'INVENTORY',
        reports: 'REPORTS',
      };

      for (const key of Object.keys(permissionTypeMap)) {
        await apiRequest('/admin/outlets/permissions/', {
          method: 'POST',
          body: {
            staffId: staff.id,
            permission: permissionTypeMap[key],
            grant: formData[key],
          },
        });
      }

      alert('Permissions updated successfully');
      setIsEditingPermissions(false);
      await fetchStaffDetails();
    } catch (err) {
      console.error('Error saving permissions:', err);
      alert('Failed to save permissions');
    }
  };

  const handleDeleteStaff = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this staff member?'
    );
    if (confirmDelete) {
      try {
        await apiRequest(`/admin/outlets/delete-staff/${staff.id}`, {
          method: 'DELETE',
        });
        alert('Staff member deleted successfully');
        navigate('/staff');
      } catch (err) {
        console.error('Error deleting staff:', err);
        alert('Failed to delete staff member');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading staff details...</div>
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error || 'Staff member not found'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Row: Back button + Tabs */}
      <div className="flex justify-start items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full bg-gray-200 hover:bg-gray-300 p-2"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black">
            <polygon points="15,5 7,12 15,19" />
          </svg>
        </button>

        <div className="flex space-x-4">
          <Button
            variant={activeTab === 'details' ? 'black' : 'secondary'}
            onClick={() => setActiveTab('details')}
          >
            Staff Details
          </Button>
          <Button
            variant={activeTab === 'permission' ? 'black' : 'secondary'}
            onClick={() => setActiveTab('permission')}
          >
            Permission
          </Button>
        </div>
      </div>

      {/* Details Tab */}
      {activeTab === 'details' && (
        <Card title={staff.user?.name || 'N/A'} className="max-w-4xl mx-auto mt-8">
          <div className="flex justify-center mb-6">
            <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-16 h-16 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {[
              ['name', 'Name'],
              ['staffRole', 'Position'],
              ['email', 'Email'],
              ['phone', 'Phone'],
            ].map(([field, label]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  disabled={!isEditingDetails}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 text-gray-900 disabled:bg-gray-100 ${
                    !isEditingDetails ? 'cursor-not-allowed' : ''
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            {isEditingDetails ? (
              <>
                <Button variant="primary" onClick={saveStaffDetails}>
                  Save Details
                </Button>
                <Button variant="secondary" onClick={() => setIsEditingDetails(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="black" onClick={() => setIsEditingDetails(true)}>
                Update Details
              </Button>
            )}
            <Button variant="danger" onClick={handleDeleteStaff}>
              Remove Staff
            </Button>
          </div>
        </Card>
      )}

      {/* Permission Tab */}
      {activeTab === 'permission' && (
        <Card title="Enable Permissions" className="max-w-4xl mx-auto mt-8">
          <div className="grid grid-cols-1 gap-8 items-center">
            <div className="space-y-6 text-lg">
              {[
                { key: 'billing', label: 'Billing' },
                { key: 'productsInsight', label: 'Product Insight' },
                { key: 'inventory', label: 'Inventory' },
                { key: 'reports', label: 'Reports' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <label
                    className={`relative inline-flex items-center ${
                      !isEditingPermissions ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData[item.key] || false}
                      disabled={!isEditingPermissions}
                      onChange={(e) => handlePermissionChange(item.key, e.target.checked)}
                    />
                    <div
                      className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                        formData[item.key] ? 'bg-theme' : 'bg-black'
                      }`}
                    ></div>
                    <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all peer-checked:translate-x-full"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center mt-6 gap-4">
            {isEditingPermissions ? (
              <>
                <Button variant="primary" onClick={savePermissions}>
                  Save Permissions
                </Button>
                <Button variant="secondary" onClick={() => setIsEditingPermissions(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="black" onClick={() => setIsEditingPermissions(true)}>
                Update Permissions
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default StaffDetails;
