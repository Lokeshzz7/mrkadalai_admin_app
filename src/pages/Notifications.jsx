import React, { useState, useRef, useEffect } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/api'; // Add this import

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('notification');
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [showCreateCouponForm, setShowCreateCouponForm] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const [notificationFormData, setNotificationFormData] = useState({
    title: '',
    type: '',
    description: '',
    scheduleDate: '',
    scheduleTime: '',
    image: null,
  });

  const [promotionFormData, setPromotionFormData] = useState({
    title: '',
    type: '',
    description: '',
    scheduleDate: '',
    scheduleTime: '',
    image: null,
  });

  const [couponFormData, setCouponFormData] = useState({
    code: '',
    description: '',
    rewardValue: '',
    minOrderValue: '',
    validFrom: '',
    validUntil: '',
    usageLimit: '',
  });

  const [autoSend, setAutoSend] = useState(false);

  const couponHeaders = ["Code", "Description", "Reward", "Min Order", "Valid Until", "Usage", "Actions"];

  // Fetch coupons on component mount and when tab changes to coupon
  useEffect(() => {
    if (activeTab === 'coupon') {
      fetchCoupons();
    }
  }, [activeTab]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token); // Debug token
      
      const data = await apiRequest('/superadmin/get-coupons/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      setCoupons(data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error(error.message || 'Error fetching coupons');
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (couponId) => {
    try {
      const token = localStorage.getItem('token');
      await apiRequest(`/superadmin/delete-coupon/${couponId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      toast.success('Coupon deleted successfully');
      fetchCoupons(); // Refresh the list
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error(error.message || 'Error deleting coupon');
    }
  };

  const couponData = coupons.map(coupon => [
    coupon.code,
    coupon.description || 'No description',
    `₹${coupon.rewardValue}`,
    `₹${coupon.minOrderValue}`,
    new Date(coupon.validUntil).toLocaleDateString(),
    `${coupon.usedCount}/${coupon.usageLimit}`,
    <div className="text-right">
      <Button 
        variant="danger" 
        onClick={() => deleteCoupon(coupon.id)}
        disabled={loading}
      >
        Remove
      </Button>
    </div>
  ]);

  const handleNotificationChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setNotificationFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setNotificationFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePromotionChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setPromotionFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setPromotionFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCouponChange = (e) => {
    const { name, value } = e.target;
    setCouponFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    console.log('Notification Data:', notificationFormData);
    toast.success("Notification Sent");
  };

  const handlePromotionSubmit = (e) => {
    e.preventDefault();
    console.log('Promotion Data:', promotionFormData);
    toast.success("Promotion Sent");
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!couponFormData.code || !couponFormData.rewardValue || !couponFormData.validFrom || 
        !couponFormData.validUntil || !couponFormData.usageLimit) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate dates
    const validFrom = new Date(couponFormData.validFrom);
    const validUntil = new Date(couponFormData.validUntil);
    const now = new Date();

    if (validFrom < now) {
      toast.error('Valid from date cannot be in the past');
      return;
    }

    if (validUntil <= validFrom) {
      toast.error('Valid until date must be after valid from date');
      return;
    }

    if (parseFloat(couponFormData.rewardValue) <= 0) {
      toast.error('Reward value must be greater than 0');
      return;
    }

    if (parseFloat(couponFormData.minOrderValue) < 0) {
      toast.error('Minimum order value cannot be negative');
      return;
    }

    if (parseInt(couponFormData.usageLimit) <= 0) {
      toast.error('Usage limit must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const couponData = {
        code: couponFormData.code.trim().toUpperCase(),
        description: couponFormData.description.trim(),
        rewardValue: parseFloat(couponFormData.rewardValue),
        minOrderValue: parseFloat(couponFormData.minOrderValue),
        validFrom: couponFormData.validFrom,
        validUntil: couponFormData.validUntil,
        usageLimit: parseInt(couponFormData.usageLimit),
      };

      console.log('Coupon data being sent:', couponData);

      const result = await apiRequest('/superadmin/create-coupon/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: couponData,
      });

      toast.success('Coupon created successfully');
      setShowCreateCouponForm(false);
      handleCouponReset();
      fetchCoupons(); 
      
      if (autoSend) {
        // TODO: Implement notification sending logic
        toast.success('Notification sent to users');
      }
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast.error(error.message || 'Error creating coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationReset = () => {
    setNotificationFormData({
      title: '',
      type: '',
      description: '',
      scheduleDate: '',
      scheduleTime: '',
      image: null,
    });
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handlePromotionReset = () => {
    setPromotionFormData({
      title: '',
      type: '',
      description: '',
      scheduleDate: '',
      scheduleTime: '',
      image: null,
    });
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleCouponReset = () => {
    setCouponFormData({
      code: '',
      description: '',
      rewardValue: '',
      minOrderValue: '',
      validFrom: '',
      validUntil: '',
      usageLimit: '',
    });
    setAutoSend(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-800">Notifications</h1>

      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Button variant={activeTab === 'notification' ? 'black' : 'secondary'} onClick={() => setActiveTab('notification')}>Notifications</Button>
          <Button variant={activeTab === 'promotion' ? 'black' : 'secondary'} onClick={() => setActiveTab('promotion')}>Promotion</Button>
          <Button variant={activeTab === 'coupon' ? 'black' : 'secondary'} onClick={() => setActiveTab('coupon')}>Coupons</Button>
        </div>
      </div>

      {/* Notification Tab */}
      {activeTab === 'notification' && (
        <Card title="Notification Details">
          <form className="space-y-4" onSubmit={handleNotificationSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" name="title" value={notificationFormData.title} onChange={handleNotificationChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority Type</label>
                <select name="type" value={notificationFormData.type} onChange={handleNotificationChange} className="w-full border rounded px-3 py-2">
                  <option value="">Select Type</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={notificationFormData.description} onChange={handleNotificationChange} className="w-full border rounded px-3 py-2" rows="2" placeholder="Enter description" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload</label>
                <input type="file" accept="image/*" name="image" onChange={handleNotificationChange} ref={fileInputRef} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date</label>
                <input type="date" name="scheduleDate" value={notificationFormData.scheduleDate} onChange={handleNotificationChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Time</label>
                <input type="time" name="scheduleTime" value={notificationFormData.scheduleTime} onChange={handleNotificationChange} className="w-full border rounded px-3 py-2" />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="danger" onClick={handleNotificationReset}>Reset</Button>
              <Button type="submit" variant="success">Send Notification</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Promotion Tab */}
      {activeTab === 'promotion' && (
        <Card title="Promotion Details">
          <form className="space-y-4" onSubmit={handlePromotionSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" name="title" value={promotionFormData.title} onChange={handlePromotionChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority Type</label>
                <select name="type" value={promotionFormData.type} onChange={handlePromotionChange} className="w-full border rounded px-3 py-2">
                  <option value="">Select Type</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={promotionFormData.description} onChange={handlePromotionChange} className="w-full border rounded px-3 py-2" rows="2" placeholder="Enter description" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload</label>
                <input type="file" accept="image/*" name="image" onChange={handlePromotionChange} ref={fileInputRef} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date</label>
                <input type="date" name="scheduleDate" value={promotionFormData.scheduleDate} onChange={handlePromotionChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Time</label>
                <input type="time" name="scheduleTime" value={promotionFormData.scheduleTime} onChange={handlePromotionChange} className="w-full border rounded px-3 py-2" />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="danger" onClick={handlePromotionReset}>Reset</Button>
              <Button type="submit" variant="success">Send Promotion</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Coupon Tab */}
      {activeTab === 'coupon' && (
        <Card title={
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Coupon Management</h2>
            {!showCreateCouponForm && (
              <Button variant="success" onClick={() => setShowCreateCouponForm(true)}>Create Coupon</Button>
            )}
          </div>
        }>
          {!showCreateCouponForm ? (
            <>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Active Coupons</h3>
              {loading ? (
                <div className="text-center py-4">Loading coupons...</div>
              ) : coupons.length > 0 ? (
                <Table headers={couponHeaders} data={couponData} className="border rounded mb-4" />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No active coupons found. Create your first coupon!
                </div>
              )}
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Create Coupon</h3>
              <form className="space-y-4" onSubmit={handleCouponSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                    <input 
                      type="text" 
                      name="code" 
                      value={couponFormData.code} 
                      onChange={handleCouponChange} 
                      className="w-full border rounded px-3 py-2" 
                      placeholder="e.g., SAVE20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reward Value (₹) *</label>
                    <input 
                      type="number" 
                      name="rewardValue" 
                      value={couponFormData.rewardValue} 
                      onChange={handleCouponChange} 
                      className="w-full border rounded px-3 py-2" 
                      placeholder="e.g., 20"
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    name="description" 
                    value={couponFormData.description} 
                    onChange={handleCouponChange} 
                    rows="2" 
                    className="w-full border rounded px-3 py-2" 
                    placeholder="Describe your coupon offer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Value (₹)</label>
                    <input 
                      type="number" 
                      name="minOrderValue" 
                      value={couponFormData.minOrderValue} 
                      onChange={handleCouponChange} 
                      className="w-full border rounded px-3 py-2" 
                      placeholder="e.g., 100"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit *</label>
                    <input 
                      type="number" 
                      name="usageLimit" 
                      value={couponFormData.usageLimit} 
                      onChange={handleCouponChange} 
                      className="w-full border rounded px-3 py-2" 
                      placeholder="e.g., 100"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid From *</label>
                    <input 
                      type="datetime-local" 
                      name="validFrom" 
                      value={couponFormData.validFrom} 
                      onChange={handleCouponChange} 
                      className="w-full border rounded px-3 py-2" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until *</label>
                    <input 
                      type="datetime-local" 
                      name="validUntil" 
                      value={couponFormData.validUntil} 
                      onChange={handleCouponChange} 
                      className="w-full border rounded px-3 py-2" 
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 mt-4">
                  <label className="text-sm font-medium text-gray-700">Auto Send Notification</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={autoSend} 
                      onChange={() => setAutoSend(!autoSend)} 
                    />
                    <div className="w-11 h-6 bg-black rounded-full peer peer-focus:ring-2 peer-checked:bg-theme after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Button 
                    type="button" 
                    variant="danger" 
                    onClick={() => { 
                      handleCouponReset(); 
                      setShowCreateCouponForm(false); 
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="success"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Coupon'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default Notifications;