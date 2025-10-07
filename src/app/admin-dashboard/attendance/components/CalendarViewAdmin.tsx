'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CalendarEvent {
  title: string;
  start: string;
  backgroundColor: string;
  textColor: string;
}

interface Employee {
  id: number;
  fullName: string;
}

export default function CalendarViewAdmin() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      fetchMonthlyAttendance(selectedEmployee, year, month);
    }
  }, [selectedEmployee, year, month]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/employees', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEmployees(response.data);
      if (response.data.length > 0) {
        setSelectedEmployee(response.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees');
      setLoading(false);
    }
  };

  const fetchMonthlyAttendance = async (employeeId: number, year: number, month: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/admin/attendance/calendar?userId=${employeeId}&year=${year}&month=${month}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const attendanceData = response.data;

      const calendarEvents: CalendarEvent[] = [];

      Object.values(attendanceData.calendarData).forEach((day: any) => {
        let title = '';
        let backgroundColor = '';
        let textColor = 'white';

        if (day.status === 'present') {
          title = '✓ Present - Shift: 9AM-6PM';
          backgroundColor = '#2563EB'; // Blue
        } else if (day.status === 'half-day') {
          title = '🟠 Late / Half-day - Shift: 9AM-1PM';
          backgroundColor = '#F59E0B'; // Amber
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
        } else {
          title = day.status;
          backgroundColor = '#9CA3AF'; // Default Gray
        }

        if (title) {
          calendarEvents.push({
            title: `${title} (${day.totalHours?.toFixed(1) || 0}h)`,
            start: day.date,
            backgroundColor,
            textColor
          });
        }
      });

      setEvents(calendarEvents);
      setError('');
    } catch (err: any) {
      console.error('Calendar fetch error:', err);
      setError(err.response?.data?.message || 'Error fetching calendar data');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (info: any) => {
    alert(`Date: ${info.event.start.toDateString()}\n${info.event.title}`);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(parseInt(e.target.value));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(parseInt(e.target.value));
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <Select value={selectedEmployee?.toString() || ''} onValueChange={(val) => setSelectedEmployee(parseInt(val))}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Employee" />
          </SelectTrigger>
          <SelectContent>
            {employees.map(emp => (
              <SelectItem key={emp.id} value={emp.id.toString()}>
                {emp.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year.toString()} onValueChange={(val) => setYear(parseInt(val))}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {[year - 1, year, year + 1].map(y => (
              <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={month.toString()} onValueChange={(val) => setMonth(parseInt(val))}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(12)].map((_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
      ) : error ? (
        <div className="text-red-600 font-semibold">{error}</div>
      ) : (
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
          height="600px"
          dayMaxEvents={6}
        />
      )}
    </div>
  );
}
