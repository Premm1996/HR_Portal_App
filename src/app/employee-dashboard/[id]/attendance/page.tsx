'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PunchInOut from './components/PunchInOut';
import DailyAttendanceCard from './components/DailyAttendanceCard';
import CalendarView from './components/CalendarView';
import RequestHistory from './components/RequestHistory';

interface AttendanceSummary {
  summary: {
    present: number;
    absent: number;
    'half-day': number;
    holiday: number;
    'week-off': number;
    totalDays: number;
  };
  presentPercentage: number;
}

export default function AttendancePage() {
  const [todayStatus, setTodayStatus] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState({ pendingELs: 0, usedELs: 0 });
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayStatus();
    fetchLeaveBalance();
    fetchAttendanceSummary();
  }, []);

  const fetchAttendanceSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/attendance/summary?year=' + new Date().getFullYear() + '&month=' + (new Date().getMonth() + 1), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAttendanceSummary(response.data);
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
    }
  };

  const fetchTodayStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/attendance/today', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTodayStatus(response.data);
    } catch (error) {
      console.error('Error fetching today status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/attendance/leave-balance', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLeaveBalance(response.data);
    } catch (error) {
      console.error('Error fetching leave balance:', error);
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Attendance Dashboard
          </h1>
          <p className="text-gray-600">Manage your daily attendance and view calendar</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Punch In/Out Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Attendance</h2>
              <PunchInOut />
            </div>

            {/* Attendance Summary Cards */}
            {attendanceSummary && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Attendance Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{attendanceSummary.summary.present}</div>
                    <div className="text-sm text-gray-600">Present Days</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-2xl font-bold text-red-600">{attendanceSummary.summary.absent}</div>
                    <div className="text-sm text-gray-600">Absent Days</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{attendanceSummary.summary['half-day']}</div>
                    <div className="text-sm text-gray-600">Half Days</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">{attendanceSummary.summary.holiday}</div>
                    <div className="text-sm text-gray-600">Holidays</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-600">{attendanceSummary.summary['week-off']}</div>
                    <div className="text-sm text-gray-600">Week-offs</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-2xl font-bold text-yellow-600">{attendanceSummary.summary.totalDays}</div>
                    <div className="text-sm text-gray-600">Total Days</div>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="text-2xl font-bold text-indigo-600">{attendanceSummary.presentPercentage}%</div>
                    <div className="text-sm text-gray-600">Attendance %</div>
                  </div>
                  <div className="text-center p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <div className="text-2xl font-bold text-teal-600">{attendanceSummary.summary.present + attendanceSummary.summary['half-day']}</div>
                    <div className="text-sm text-gray-600">Working Days</div>
                  </div>
                </div>
              </div>
            )}

            {/* Leave Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending ELs</h3>
                    <p className="text-2xl font-bold text-green-600">{leaveBalance.pendingELs}</p>
                    <p className="text-sm text-gray-600">Earned Leaves Available</p>
                  </div>
                  <div className="text-4xl text-green-200">📅</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Used ELs</h3>
                    <p className="text-2xl font-bold text-orange-600">{leaveBalance.usedELs}</p>
                    <p className="text-sm text-gray-600">Leaves Taken This Year</p>
                  </div>
                  <div className="text-4xl text-orange-200">📊</div>
                </div>
              </div>
            </div>

            {/* Daily Attendance Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <DailyAttendanceCard />
            </div>

            {/* Requests & Leave Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Requests & Leave</h2>
              <RequestHistory />
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <CalendarView />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
