'use client';

import React from 'react';
import LiveAttendanceTracker from './components/LiveAttendanceTracker';
import HolidayManagement from './components/HolidayManagement';

export default function AdminAttendance() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Attendance Dashboard</h1>
        <p className="text-gray-600">Manage live attendance, holidays, and leaves</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <LiveAttendanceTracker />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <HolidayManagement />
        </div>
      </div>
    </div>
  );
}
