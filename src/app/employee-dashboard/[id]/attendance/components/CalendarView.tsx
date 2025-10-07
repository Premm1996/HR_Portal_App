'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

interface CalendarEvent {
  title: string;
  start: string;
  backgroundColor: string;
  textColor: string;
}

export default function CalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      const attendanceData = response.data;

      const calendarEvents: CalendarEvent[] = [];

      // Add attendance events - attendanceData.calendarData is an object with date keys
      Object.values(attendanceData.calendarData).forEach((day: any) => {
        let title = '';
        let backgroundColor = '';
        let textColor = 'white';

        if (day.status === 'present') {
          title = '✓ Present - Shift: 9AM-6PM';
          backgroundColor = '#2563EB'; // Blue
        } else if (day.status === 'half-day') {
          title = '🟠 Half-day - Shift: 9AM-1PM';
          backgroundColor = '#60A5FA'; // Light Blue
        } else if (day.status === 'absent') {
          title = '❌ Absent';
          backgroundColor = '#EF4444'; // Red
        } else if (day.status === 'pending') {
          title = '🕒 Pending';
          backgroundColor = '#6B7280'; // Gray
        } else if (day.status === 'week-off') {
          title = '🏠 Week-off';
          backgroundColor = '#374151'; // Dark Gray
        } else if (day.status === 'holiday') {
          title = `☀ ${day.holidayName || 'Holiday'}`;
          backgroundColor = '#8B5CF6'; // Purple
        }

        if (title) {
          calendarEvents.push({
            title: `${title} (${day.totalHours?.toFixed(1)}h)`,
            start: day.date,
            backgroundColor,
            textColor
          });
        }
      });



      // Add leave events
      const leavesResponse = await axios.get('/api/attendance/leaves', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      leavesResponse.data.forEach((leave: any) => {
        if (leave.status === 'approved') {
          calendarEvents.push({
            title: `🏖 ${leave.leave_type}`,
            start: leave.start_date,
            backgroundColor: '#06B6D4', // Cyan
            textColor: 'white'
          });
        }
      });

      setEvents(calendarEvents);
    } catch (err: any) {
      console.error('Calendar fetch error:', err);
      setError(err.response?.data?.message || 'Error fetching calendar data');
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (info: any) => {
    // Show detailed information in a tooltip or modal
    alert(`Date: ${info.event.start.toDateString()}\n${info.event.title}`);
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>;
  }

  if (error) {
    return <div className="text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Attendance Calendar</h3>
      </div>

      <div className="h-96">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
          }}
          events={events}
          eventClick={handleEventClick}
          height="100%"
          aspectRatio={1.5}
          dayMaxEvents={6}
        />
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
            <span>Present (9AM-6PM)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-400 rounded mr-2"></div>
            <span>Half-day (9AM-1PM)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span>Absent</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-500 rounded mr-2"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
            <span>Holiday</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-cyan-500 rounded mr-2"></div>
            <span>Leave</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-700 rounded mr-2"></div>
            <span>Week-off</span>
          </div>
        </div>
      </div>
    </div>
  );
}
