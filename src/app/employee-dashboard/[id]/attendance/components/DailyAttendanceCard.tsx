'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface AttendanceData {
  punchInTime: string | null;
  punchOutTime: string | null;
  totalHours: number;
  breakCount: number;
  totalBreakDuration: number;
  productionHours: number;
  status: 'Present' | 'Half-day' | 'Absent';
  progress: number;
}

export default function DailyAttendanceCard() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  const fetchTodayStatus = async () => {
    try {
      const response = await axios.get('/api/attendance/today');
      setAttendanceData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching attendance data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'text-green-600 bg-green-100';
      case 'Half-day': return 'text-orange-600 bg-orange-100';
      case 'Absent': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>;
  }

  if (error) {
    return <div className="text-red-600 font-semibold">{error}</div>;
  }

  if (!attendanceData) {
    return <div className="text-gray-600">No attendance data available</div>;
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Attendance</h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Punch In:</span>
          <span className="font-semibold">
            {attendanceData.punchInTime ? new Date(attendanceData.punchInTime).toLocaleTimeString() : 'Not punched in'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Punch Out:</span>
          <span className="font-semibold">
            {attendanceData.punchOutTime ? new Date(attendanceData.punchOutTime).toLocaleTimeString() : 'Not punched out'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Total Hours:</span>
          <span className="font-semibold">{attendanceData.totalHours.toFixed(2)} hrs</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Breaks:</span>
          <span className="font-semibold">{attendanceData.breakCount} ({attendanceData.totalBreakDuration.toFixed(1)} hrs)</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Production Hours:</span>
          <span className="font-semibold">{attendanceData.productionHours.toFixed(2)} hrs</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(attendanceData.status)}`}>
            {attendanceData.status}
          </span>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress to 9 hrs target</span>
            <span>{attendanceData.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${getProgressColor(attendanceData.progress)}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(attendanceData.progress, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
