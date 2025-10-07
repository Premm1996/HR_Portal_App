"use client";

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function Notification({
  type,
  message,
  onClose,
  autoClose = true,
  duration = 5000
}: NotificationProps) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <AlertCircle className="w-5 h-5 text-blue-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20';
      default:
        return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-sm w-full
      animate-in slide-in-from-right-2 duration-300
    `}>
      <div className={`
        ${getBgColor()}
        border rounded-lg p-4 shadow-lg backdrop-blur-sm
        transform transition-all duration-200 hover:scale-105
      `}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${getTextColor()}`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar for auto-close */}
        {autoClose && (
          <div className="mt-3">
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div
                className={`h-1 rounded-full transition-all duration-100 ${
                  type === 'success' ? 'bg-green-400' :
                  type === 'error' ? 'bg-red-400' :
                  type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                }`}
                style={{
                  width: '100%',
                  animation: `shrink ${duration}ms linear forwards`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Toast container component for managing multiple notifications
interface ToastContainerProps {
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ notifications, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="transform transition-all duration-300"
          style={{
            transform: `translateY(${index * 10}px)`,
            zIndex: 50 - index
          }}
        >
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => onRemove(notification.id)}
          />
        </div>
      ))}
    </div>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = React.useState<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>>([]);

  const addNotification = React.useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    message: string
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, message }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);

    return id;
  }, []);

  const removeNotification = React.useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  };
}
