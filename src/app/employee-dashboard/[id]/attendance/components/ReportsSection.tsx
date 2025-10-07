'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyData {
  month: string;
  attendancePercentage: number;
  totalDays: number;
  presentDays: number;
}

interface Notification {
  id: number;
  type: string;
  message: string;
  created_at: string;
  read: boolean;
}

export default function ReportsSection() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      const [monthlyRes, notificationsRes] = await Promise.all([
        axios.get('/api/attendance/reports/monthly'),
        axios.get('/api/notifications')
      ]);

      setMonthlyData(monthlyRes.data);
      setNotifications(notificationsRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching reports data');
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: monthlyData.map(data => data.month),
    datasets: [
      {
        label: 'Attendance %',
        data: monthlyData.map(data => data.attendancePercentage),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Attendance Percentage',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications(notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>;
  }

  if (error) {
    return <div className="text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Monthly Attendance Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Attendance Report</h3>
        <div className="h-64">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Notifications</h3>

        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No notifications</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border-l-4 ${
                  notification.read
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markNotificationAsRead(notification.id)}
                      className="ml-4 text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
