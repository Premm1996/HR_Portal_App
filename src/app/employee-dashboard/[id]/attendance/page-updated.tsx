'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PunchInOut from './components/PunchInOut';
import BreakManagement from './components/BreakManagement';
import DailyAttendanceCard from './components/DailyAttendanceCard';
import CalendarView from './components/CalendarView';
import CorrectionRequestForm from './components/CorrectionRequestForm';
import LeaveRequestForm from './components/LeaveRequestForm';
import RequestHistory from './components/RequestHistory';
import ReportsSection from './components/ReportsSection';

export default function AttendancePage() {
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'reports'>('overview');

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  const fetchTodayStatus = async () => {
    try {
      const response = await axios.get('/api/attendance/today');
      setTodayStatus(response.data);
    } catch (error) {
      console.error('Error fetching today status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Attendance Dashboard</h1>
        <p className="text-gray-600">Manage your daily attendance, breaks, and requests</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'requests'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Requests & Leave
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'reports'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Reports
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Punch In/Out and Break Management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Punch In/Out</h2>
              <PunchInOut />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Break Management</h2>
              <BreakManagement />
            </div>
          </div>

          {/* Daily Attendance Card */}
          {todayStatus && <DailyAttendanceCard />}

          {/* Calendar View */}
          <CalendarView />
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-8">
          {/* Request Forms */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CorrectionRequestForm />
            <LeaveRequestForm />
          </div>

          {/* Request History */}
          <RequestHistory />
        </div>
      )}

      {activeTab === 'reports' && (
        <ReportsSection />
      )}
    </div>
  );
}
