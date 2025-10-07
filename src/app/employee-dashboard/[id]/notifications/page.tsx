'use client';

import React, { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationsPage({ params }: { params: { id: string } }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Welcome to Truerize!',
      message: 'Your account has been successfully activated. Please complete your profile to get started.',
      date: '2023-10-01',
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'Document Approved',
      message: 'Your offer letter has been approved and is now available for download.',
      date: '2023-10-05',
      read: true
    },
    {
      id: 3,
      type: 'warning',
      title: 'Document Pending Review',
      message: 'Your ID card is pending review. Please check back in 24-48 hours.',
      date: '2023-10-08',
      read: false
    },
    {
      id: 4,
      type: 'info',
      title: 'Payroll Update',
      message: 'Your salary for October has been processed and will be credited on the 1st.',
      date: '2023-10-10',
      read: true
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex items-center space-x-4">
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount} unread
            </span>
          )}
          <button
            onClick={markAllAsRead}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Mark All Read
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
            <p className="text-slate-400">You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-[#1E2A44] rounded-xl p-6 border-l-4 transition-all ${
                notification.read ? 'border-slate-600' : 'border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <h3 className={`font-semibold ${notification.read ? 'text-slate-300' : 'text-white'}`}>
                      {notification.title}
                    </h3>
                    <p className={`text-sm mt-1 ${notification.read ? 'text-slate-400' : 'text-slate-300'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">{notification.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-slate-400 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
