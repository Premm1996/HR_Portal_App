'use client';

import React, { useState, useEffect } from 'react';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  target_type: 'all' | 'employee' | 'admin' | 'department';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_read: boolean;
  created_at: string;
  created_by_name?: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'info' | 'success' | 'warning' | 'error' | 'system'>('info');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [status, setStatus] = useState('');
  const [stats, setStats] = useState({ total: 0, unread: 0, info_count: 0, warning_count: 0, error_count: 0, success_count: 0 });

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch notifications');

      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      setStatus('Error loading notifications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch notification stats
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/notifications/stats/overview', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch stats');

      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          message,
          type,
          priority
        }),
      });

      if (!res.ok) throw new Error('Failed to send notification');

      const data = await res.json();
      if (data.success) {
        setMessage('');
        setTitle('');
        setStatus('Notification sent successfully!');
        fetchNotifications(); // Refresh the list
        fetchStats(); // Refresh stats
      }
    } catch (error: any) {
      setStatus(error.message || 'Error sending notification');
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to mark as read');

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, is_read: true }
            : notif
        )
      );
      fetchStats(); // Refresh stats
    } catch (error: any) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to mark all as read');

      // Update local state
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      fetchStats(); // Refresh stats
    } catch (error: any) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (notificationId: number) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete notification');

      // Remove from local state
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      fetchStats(); // Refresh stats
    } catch (error: any) {
      console.error('Error deleting notification:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'system': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications Management</h1>
        <button
          onClick={handleMarkAllAsRead}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Mark All Read
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{stats.unread}</div>
          <div className="text-sm text-gray-600">Unread</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.info_count}</div>
          <div className="text-sm text-gray-600">Info</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{stats.warning_count}</div>
          <div className="text-sm text-gray-600">Warnings</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{stats.error_count}</div>
          <div className="text-sm text-gray-600">Errors</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{stats.success_count}</div>
          <div className="text-sm text-gray-600">Success</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Notification Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create New Notification</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Enter notification title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={4}
                placeholder="Enter notification message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Send Notification
            </button>
          </form>
          {status && (
            <p className={`mt-4 text-sm p-3 rounded-md ${
              status.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {status}
            </p>
          )}
        </div>

        {/* Notifications List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No notifications found</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg ${
                    notification.is_read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      <span className={`w-3 h-3 rounded-full ${getPriorityColor(notification.priority)}`}></span>
                      {!notification.is_read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <h3 className="font-medium text-gray-900 mb-1">{notification.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Target: {notification.target_type}</span>
                    <span>By: {notification.created_by_name || 'System'}</span>
                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(notification.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
