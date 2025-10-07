'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Employee {
  id: number;
  name: string;
  status: 'working' | 'on_break' | 'absent' | 'not_punched';
  punchInTime?: string;
  breakStartTime?: string;
  totalHours?: number;
  department?: string;
}

export default function LiveAttendanceTracker() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchLiveAttendance();
    const interval = setInterval(fetchLiveAttendance, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchLiveAttendance = async () => {
    try {
      const response = await axios.get('/api/admin/attendance/live');
      setEmployees(response.data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching live attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'bg-green-100 text-green-800 border-green-200';
      case 'on_break': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'not_punched': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working': return '🟢';
      case 'on_break': return '🟡';
      case 'absent': return '🔴';
      case 'not_punched': return '⚪';
      default: return '⚪';
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '--:--';
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (hours?: number) => {
    if (!hours) return '--';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const handleOverridePunch = async (employeeId: number, action: 'punch_in' | 'punch_out') => {
    if (!confirm(`Are you sure you want to ${action.replace('_', ' ')} for this employee?`)) return;

    try {
      await axios.post(`/api/admin/attendance/override/${employeeId}`, { action });
      fetchLiveAttendance();
      alert('Punch override successful');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Override failed');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Live Attendance Tracker</h3>
          <p className="text-sm text-gray-600">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={fetchLiveAttendance}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {employees.filter(e => e.status === 'working').length}
          </div>
          <div className="text-sm text-green-800">Working</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {employees.filter(e => e.status === 'on_break').length}
          </div>
          <div className="text-sm text-yellow-800">On Break</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {employees.filter(e => e.status === 'absent').length}
          </div>
          <div className="text-sm text-red-800">Absent</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">
            {employees.filter(e => e.status === 'not_punched').length}
          </div>
          <div className="text-sm text-gray-800">Not Punched</div>
        </div>
      </div>

      {/* Employee List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Punch In
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Break Start
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <motion.tr
                key={employee.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    <div className="text-sm text-gray-500">{employee.department}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
                    {getStatusIcon(employee.status)} {employee.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatTime(employee.punchInTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatTime(employee.breakStartTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDuration(employee.totalHours)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {employee.status === 'not_punched' && (
                      <button
                        onClick={() => handleOverridePunch(employee.id, 'punch_in')}
                        className="text-green-600 hover:text-green-900 text-sm"
                      >
                        Force Punch In
                      </button>
                    )}
                    {employee.status === 'working' && (
                      <button
                        onClick={() => handleOverridePunch(employee.id, 'punch_out')}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Force Punch Out
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {employees.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No employees found</p>
        </div>
      )}
    </div>
  );
}
