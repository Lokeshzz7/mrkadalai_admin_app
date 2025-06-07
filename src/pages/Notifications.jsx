import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('notification');
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

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    console.log('Notification Data:', notificationFormData);
    alert("Notification Sent");
  };

  const handlePromotionSubmit = (e) => {
    e.preventDefault();
    console.log('Promotion Data:', promotionFormData);
    alert("Promotion Sent");
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
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
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

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-800">Notifications</h1>

      <div className='flex justify-between items-center'>
        <div className='flex space-x-4'>
          <Button
            variant={activeTab === 'notification' ? 'black' : 'secondary'}
            onClick={() => setActiveTab('notification')}
          >
            Notifications
          </Button>
          <Button
            variant={activeTab === 'promotion' ? 'black' : 'secondary'}
            onClick={() => setActiveTab('promotion')}
          >
            Promotion
          </Button>
        </div>
      </div>

      {/* Notification Tab */}
      {activeTab === 'notification' && (
        <Card title="Notification Details">
          <form className="space-y-4" onSubmit={handleNotificationSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={notificationFormData.title}
                  onChange={handleNotificationChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority Type</label>
                <select
                  name="type"
                  value={notificationFormData.type}
                  onChange={handleNotificationChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Type</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={notificationFormData.description}
                onChange={handleNotificationChange}
                className="w-full border rounded px-3 py-2"
                rows="2"
                placeholder="Enter description"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleNotificationChange}
                  ref={fileInputRef}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date</label>
                <input
                  type="date"
                  name="scheduleDate"
                  value={notificationFormData.scheduleDate}
                  onChange={handleNotificationChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Time</label>
                <input
                  type="time"
                  name="scheduleTime"
                  value={notificationFormData.scheduleTime}
                  onChange={handleNotificationChange}
                  className="w-full border rounded px-3 py-2"
                />
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
                <input
                  type="text"
                  name="title"
                  value={promotionFormData.title}
                  onChange={handlePromotionChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority Type</label>
                <select
                  name="type"
                  value={promotionFormData.type}
                  onChange={handlePromotionChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Type</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={promotionFormData.description}
                onChange={handlePromotionChange}
                className="w-full border rounded px-3 py-2"
                rows="2"
                placeholder="Enter description"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handlePromotionChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date</label>
                <input
                  type="date"
                  name="scheduleDate"
                  value={promotionFormData.scheduleDate}
                  onChange={handlePromotionChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Time</label>
                <input
                  type="time"
                  name="scheduleTime"
                  value={promotionFormData.scheduleTime}
                  onChange={handlePromotionChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="danger" onClick={handlePromotionReset}>Reset</Button>
              <Button type="submit" variant="success">Send Promotion</Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default Notifications;
