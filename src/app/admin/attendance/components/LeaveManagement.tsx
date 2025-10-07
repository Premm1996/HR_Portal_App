'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface LeaveRequest {
  id: number;
  fullName: string;
  date: string;
  type: string;
  reason: string;
  status: string;
}

export default function LeaveManagement() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/attendance/admin/leaves');
      setLeaveRequests(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const processRequest = async (id, action) => {
    setProcessingId(id);
    setError('');
    try {
      await axios.post('/api/attendance/admin/leaves/process', { id, action });
      await fetchLeaveRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process leave request');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Leave Requests</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Loading leave requests...</div>
      ) : leaveRequests.length === 0 ? (
        <div>No leave requests found.</div>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Employee</th>
              <th className="border border-gray-300 p-2 text-left">Date</th>
              <th className="border border-gray-300 p-2 text-left">Type</th>
              <th className="border border-gray-300 p-2 text-left">Reason</th>
              <th className="border border-gray-300 p-2 text-left">Status</th>
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{req.fullName}</td>
                <td className="border border-gray-300 p-2">{req.date}</td>
                <td className="border border-gray-300 p-2">{req.type}</td>
                <td className="border border-gray-300 p-2">{req.reason}</td>
                <td className="border border-gray-300 p-2 capitalize">{req.status}</td>
                <td className="border border-gray-300 p-2 space-x-2">
                  {req.status === 'pending' && (
                    <>
                      <button
                        disabled={processingId === req.id}
                        onClick={() => processRequest(req.id, 'approve')}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        disabled={processingId === req.id}
                        onClick={() => processRequest(req.id, 'reject')}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {req.status !== 'pending' && <span>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
