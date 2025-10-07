'use client';

import React, { useState } from 'react';
import axios from 'axios';

const leaveTypes = [
  { value: 'sick', label: 'Sick Leave' },
  { value: 'casual', label: 'Casual Leave' },
  { value: 'annual', label: 'Annual Leave' },
  { value: 'maternity', label: 'Maternity Leave' },
  { value: 'paternity', label: 'Paternity Leave' },
  { value: 'emergency', label: 'Emergency Leave' },
];

export default function LeaveRequestForm() {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [halfDay, setHalfDay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post('/api/attendance/leave/request', {
        type: leaveType,
        startDate,
        endDate,
        reason,
        halfDay
      });

      setSuccess('Leave request submitted successfully!');
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setReason('');
      setHalfDay(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error submitting leave request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Request Leave</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Leave Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {leaveTypes.map(({ value, label }) => (
              <label
                key={value}
                className={`cursor-pointer rounded-lg border p-3 flex items-center justify-center text-center transition-colors duration-200
                  ${leaveType === value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}
                `}
              >
                <input
                  type="radio"
                  name="leaveType"
                  value={value}
                  checked={leaveType === value}
                  onChange={() => setLeaveType(value)}
                  className="hidden"
                  required
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="halfDay"
            checked={halfDay}
            onChange={(e) => setHalfDay(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="halfDay" className="text-sm font-medium text-gray-700">
            Half-day leave
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {!halfDay && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Please provide a reason for your leave request..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Leave Request'}
        </button>
      </form>

      {error && <div className="mt-4 text-red-600 font-semibold">{error}</div>}
      {success && <div className="mt-4 text-green-600 font-semibold">{success}</div>}
    </div>
  );
}
