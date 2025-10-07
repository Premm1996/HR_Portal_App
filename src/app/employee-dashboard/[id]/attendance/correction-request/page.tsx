'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { motion } from 'framer-motion';

interface AttendanceDay {
  date: string;
  status: string;
  punchInTime?: string;
  punchOutTime?: string;
  totalHours?: number;
}

import { useRouter } from 'next/navigation';

export default function CorrectionRequestPage() {
  const router = useRouter();
  const [attendanceData, setAttendanceData] = useState<AttendanceDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMonthlyAttendance();
  }, []);

  const fetchMonthlyAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const response = await axios.get(`/api/attendance/monthly?year=${year}&month=${month}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data.calendarData;
      const attendanceArray: AttendanceDay[] = Object.values(data) as AttendanceDay[];
      setAttendanceData(attendanceArray);
    } catch (err: any) {
      console.error('Error fetching attendance:', err);
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (arg: any) => {
    const clickedDate = arg.dateStr;
    const dayData = attendanceData.find(day => day.date === clickedDate);

    if (dayData) {
      setSelectedDate(clickedDate);
      setReason('');
      setError('');
      setSuccess('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !reason.trim()) {
      setError('Please select a date and provide a reason');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/attendance/corrections', {
        date: selectedDate,
        reason: reason.trim()
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess('Correction request submitted successfully!');
      setSelectedDate(null);
      setReason('');
    } catch (err: any) {
      console.error('Error submitting correction request:', err);
      setError(err.response?.data?.message || 'Failed to submit correction request');
    } finally {
      setSubmitting(false);
    }
  };

  const getEventColor = (status: string) => {
    switch (status) {
      case 'present': return '#10B981'; // Green
      case 'half-day': return '#F59E0B'; // Orange
      case 'absent': return '#EF4444'; // Red
      case 'pending': return '#6B7280'; // Gray
      case 'week-off': return '#374151'; // Dark Gray
      case 'holiday': return '#8B5CF6'; // Purple
      default: return '#6B7280';
    }
  };

  const calendarEvents = attendanceData.map(day => ({
    title: day.status === 'present' ? `✓ ${day.totalHours?.toFixed(1)}h` :
           day.status === 'half-day' ? `🟠 ${day.totalHours?.toFixed(1)}h` :
           day.status === 'absent' ? '❌ Absent' :
           day.status === 'pending' ? '🕒 Pending' :
           day.status === 'week-off' ? '🏠 Week-off' :
           day.status === 'holiday' ? '☀ Holiday' : day.status,
    start: day.date,
    backgroundColor: getEventColor(day.status),
    textColor: 'white'
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Attendance Correction Request</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Select Date</h2>
          <p className="text-sm text-gray-600 mb-4">
            Click on any date in your attendance calendar to request a correction for that day.
          </p>

          <div className="h-96">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={calendarEvents}
              dateClick={handleDateClick}
              height="100%"
              aspectRatio={1}
              dayMaxEvents={2}
            />
          </div>

          <div className="mt-4 text-xs text-gray-600">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                <span>Present</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded mr-1"></div>
                <span>Half-day</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
                <span>Absent</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded mr-1"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded mr-1"></div>
                <span>Holiday</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Correction Request</h2>

          {selectedDate ? (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Date: {new Date(selectedDate).toLocaleDateString()}
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Correction *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please explain why you need this correction..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitting ? 'Submitting...' : 'Submit Correction Request'}
              </motion.button>
            </motion.form>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📅</div>
              <p>Please select a date from the calendar to request a correction.</p>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <motion.div
          className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {success}
        </motion.div>
      )}

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={() => router.back()}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
