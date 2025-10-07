'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Employee {
  id: number;
  fullName: string;
}

interface BreakLog {
  id: number;
  employeeName: string;
  date: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  reason: string;
  status: string;
}

export default function BreakLogs() {
  const [breakLogs, setBreakLogs] = useState<BreakLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);

  const fetchBreakLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = selectedEmployee ? { employeeId: selectedEmployee } : {};
      const response = await axios.get('/api/attendance/admin/break-logs', { params });
      setBreakLogs(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch break logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/admin/employees');
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to fetch employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchBreakLogs();
  }, [selectedEmployee]);

  const approveBreak = async (id) => {
    try {
      await axios.post('/api/attendance/admin/break-logs/approve', { id });
      await fetchBreakLogs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve break');
    }
  };

  const rejectBreak = async (id) => {
    try {
      await axios.post('/api/attendance/admin/break-logs/reject', { id });
      await fetchBreakLogs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject break');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Break Logs</h2>
      <div className="mb-4">
        <label className="mr-2">Filter by Employee:</label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="border border-gray-300 p-1"
        >
          <option value="">All Employees</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.fullName}
            </option>
          ))}
        </select>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Loading break logs...</div>
      ) : breakLogs.length === 0 ? (
        <div>No break logs found.</div>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Employee</th>
              <th className="border border-gray-300 p-2 text-left">Date</th>
              <th className="border border-gray-300 p-2 text-left">Start Time</th>
              <th className="border border-gray-300 p-2 text-left">End Time</th>
              <th className="border border-gray-300 p-2 text-left">Duration (min)</th>
              <th className="border border-gray-300 p-2 text-left">Reason</th>
              <th className="border border-gray-300 p-2 text-left">Status</th>
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {breakLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{log.employeeName}</td>
                <td className="border border-gray-300 p-2">{log.date}</td>
                <td className="border border-gray-300 p-2">{log.startTime}</td>
                <td className="border border-gray-300 p-2">{log.endTime || '—'}</td>
                <td className="border border-gray-300 p-2">{log.durationMinutes}</td>
                <td className="border border-gray-300 p-2">{log.reason}</td>
                <td className="border border-gray-300 p-2 capitalize">{log.status}</td>
                <td className="border border-gray-300 p-2 space-x-2">
                  {log.status === 'pending' && (
                    <>
                      <button
                        onClick={() => approveBreak(log.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectBreak(log.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {log.status !== 'pending' && <span>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
