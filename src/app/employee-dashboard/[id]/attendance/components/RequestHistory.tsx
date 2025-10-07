'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface CorrectionRequest {
  id: number;
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  admin_remarks?: string;
}

interface LeaveRequest {
  id: number;
  type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  admin_remarks?: string;
}

export default function RequestHistory() {
  const [correctionRequests, setCorrectionRequests] = useState<CorrectionRequest[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'corrections' | 'leaves'>('corrections');
  const router = useRouter();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const [correctionsRes, leavesRes] = await Promise.all([
        axios.get('/api/attendance/corrections', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        axios.get('/api/attendance/leaves', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ]);

      setCorrectionRequests(correctionsRes.data);
      setLeaveRequests(leavesRes.data);
    } catch (err: any) {
      console.error('Request history fetch error:', err);
      setError(err.response?.data?.message || 'Error fetching request history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>;
  }

  if (error) {
    return <div className="text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Request History</h3>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('corrections')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'corrections'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Correction Requests ({correctionRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'leaves'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Leave Requests ({leaveRequests.length})
        </button>
      </div>

      {activeTab === 'corrections' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-gray-800">Correction Requests</h4>
            <button
              onClick={() => router.push(`/employee-dashboard/${window.location.pathname.split('/')[2]}/attendance/correction-request`)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              New Correction Request
            </button>
          </div>

          {correctionRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No correction requests found</p>
          ) : (
            correctionRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Correction for {formatDate(request.date)}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Submitted on {formatDate(request.created_at)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{request.reason}</p>
                {request.admin_remarks && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-700">Admin Remarks:</p>
                    <p className="text-sm text-gray-600">{request.admin_remarks}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'leaves' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-gray-800">Leave Requests</h4>
            <button
              onClick={() => router.push(`/employee-dashboard/${window.location.pathname.split('/')[2]}/attendance/leave-application`)}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              New Leave Request
            </button>
          </div>

          {leaveRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No leave requests found</p>
          ) : (
            leaveRequests.map((request) => (
              <div
                key={request.id}
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/employee-dashboard/${window.location.pathname.split('/')[2]}/attendance/leave-application`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Leave
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formatDate(request.start_date)} {request.end_date && request.start_date !== request.end_date ? `to ${formatDate(request.end_date)}` : ''}
                    </p>
                    <p className="text-sm text-gray-600">
                      Submitted on {formatDate(request.created_at)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{request.reason}</p>
                {request.admin_remarks && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-700">Admin Remarks:</p>
                    <p className="text-sm text-gray-600">{request.admin_remarks}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
