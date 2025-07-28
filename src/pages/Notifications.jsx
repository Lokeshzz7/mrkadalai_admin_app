import React, { useState, useRef } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('notification');
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [showCreateCouponForm, setShowCreateCouponForm] = useState(false);
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
    trigger: '',
    reward: '',
    minOrder: '',
    paymentMethod: '',
    validity: '',
    couponType: '',
  });

  const [autoSend, setAutoSend] = useState(false);

  const couponHeaders = ["Code", "Description", "Reward", "Min Order", "Validity", "Actions"];

  const couponData = [
    [
      "SAVE20",
      "Save ₹20 on orders above ₹100",
      "₹20",
      "₹100",
      "2025-12-31",
      <div className="text-right">
        <Button variant="danger">Remove</Button>
      </div>
    ]
  ];

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

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    console.log('Coupon Data:', couponFormData, 'Auto Send:', autoSend);
    toast.success("Coupon Created");
    setShowCreateCouponForm(false);
    handleCouponReset();
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
      trigger: '',
      reward: '',
      minOrder: '',
      paymentMethod: '',
      validity: '',
      couponType: '',
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
              <Table headers={couponHeaders} data={couponData} className="border rounded mb-4" />
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Create Coupon</h3>
              <form className="space-y-4" onSubmit={handleCouponSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                    <input type="text" name="code" value={couponFormData.code} onChange={handleCouponChange} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Condition</label>
                    <input type="text" name="trigger" value={couponFormData.trigger} onChange={handleCouponChange} className="w-full border rounded px-3 py-2" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={couponFormData.description} onChange={handleCouponChange} rows="2" className="w-full border rounded px-3 py-2" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reward Value</label>
                    <input type="text" name="reward" value={couponFormData.reward} onChange={handleCouponChange} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Value</label>
                    <input type="text" name="minOrder" value={couponFormData.minOrder} onChange={handleCouponChange} className="w-full border rounded px-3 py-2" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid Payment Method</label>
                    <input type="text" name="paymentMethod" value={couponFormData.paymentMethod} onChange={handleCouponChange} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Validity</label>
                    <input type="date" name="validity" value={couponFormData.validity} onChange={handleCouponChange} className="w-full border rounded px-3 py-2" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Type</label>
                  <input type="text" name="couponType" value={couponFormData.couponType} onChange={handleCouponChange} className="w-full border rounded px-3 py-2" />
                </div>

                <div className="flex items-center space-x-3 mt-4">
                  <label className="text-sm font-medium text-gray-700">Auto Send Notification</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={autoSend} onChange={() => setAutoSend(!autoSend)} />
                    <div className="w-11 h-6 bg-black rounded-full peer peer-focus:ring-2 peer-checked:bg-theme after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Button type="button" variant="danger" onClick={() => { handleCouponReset(); setShowCreateCouponForm(false); }}>Cancel</Button>
                  <Button type="submit" variant="success">Create Coupon</Button>
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
