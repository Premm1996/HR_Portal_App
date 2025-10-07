'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Clock, CheckCircle, AlertCircle, Info, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';

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

export default function EmployeeNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, unread: 0 });

  useEffect(() => {
    fetchNotifications();
  }, []);

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
        setStats({
          total: data.notifications.length,
          unread: data.notifications.filter((n: Notification) => !n.is_read).length
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
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

      // Update stats
      setStats(prev => ({ ...prev, unread: prev.unread - 1 }));
    } catch (error) {
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

      // Update stats
      setStats(prev => ({ ...prev, unread: 0 }));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'system':
        return <Bell className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-white p-6 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"
        ></motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-3xl p-8 mb-8 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/employee-dashboard/home')}
                className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-white hover:bg-white/30 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </motion.button>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-lg flex items-center">
                  <Bell className="w-8 h-8 mr-3" />
                  Notifications
                </h1>
                <p className="text-indigo-100 text-lg font-medium drop-shadow-md mt-1">
                  Stay updated with the latest announcements
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-extrabold drop-shadow-lg">
                    {stats.total}
                  </div>
                  <p className="text-indigo-200 text-sm font-medium drop-shadow-sm">Total</p>
                </div>
                {stats.unread > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-extrabold drop-shadow-lg text-red-300">
                      {stats.unread}
                    </div>
                    <p className="text-indigo-200 text-sm font-medium drop-shadow-sm">Unread</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {stats.unread > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMarkAllAsRead}
              className="absolute top-4 right-4 flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-white hover:bg-white/30 transition-all duration-300"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark All Read
            </motion.button>
          )}
        </motion.div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center"
          >
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No notifications yet</h3>
            <p className="text-gray-500">You'll see important updates and announcements here.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -2, scale: 1.01 }}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${getPriorityColor(notification.priority)} relative overflow-hidden group ${
                  !notification.is_read ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                          notification.is_read ? 'bg-gray-100' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                        }`}>
                          {notification.is_read ? (
                            <CheckCircle className="w-6 h-6 text-gray-600" />
                          ) : (
                            getTypeIcon(notification.type)
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.is_read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-gray-700 text-base leading-relaxed mb-3">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {new Date(notification.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                              {notification.type}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                              {notification.priority} priority
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {notification.created_by_name && (
                              <span className="text-xs text-gray-400">
                                by {notification.created_by_name}
                              </span>
                            )}
                            {!notification.is_read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Mark Read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
