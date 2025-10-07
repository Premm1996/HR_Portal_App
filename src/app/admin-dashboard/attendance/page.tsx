'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CalendarViewAdmin from './components/CalendarViewAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Search, Calendar, Users, FileText } from 'lucide-react';

interface AttendanceRecord {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  position: string;
  date: string;
  punchInTime: string;
  punchOutTime: string;
  totalHours: number;
  status: string;
}

interface CurrentStatusRecord {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  position: string;
  punchInTime: string | null;
  punchOutTime: string | null;
  totalHours: number | null;
  status: string;
  currentBreak: {
    breakStartTime: string | null;
    status: string;
  } | null;
}

interface ReportData {
  employeeName: string;
  email: string;
  department: string;
  presentDays: number;
  halfDays: number;
  absentDays: number;
  weekOffDays: number;
  holidayDays: number;
  totalHours: number;
  avgDailyHours: number;
  attendancePercentage: number;
}

export default function AdminAttendancePage() {
  const [activeTab, setActiveTab] = useState('records');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    userId: '',
    date: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  const [reportFilters, setReportFilters] = useState({
    startDate: '',
    endDate: '',
    department: '',
    format: 'json'
  });

  const [currentStatusRecords, setCurrentStatusRecords] = useState<CurrentStatusRecord[]>([]);
  const [loadingCurrentStatus, setLoadingCurrentStatus] = useState(false);

  useEffect(() => {
    fetchAttendanceRecords();
  }, [filters]);

  useEffect(() => {
    if (activeTab === 'current-status') {
      fetchCurrentStatus();
      // Set up real-time updates every 30 seconds
      const interval = setInterval(fetchCurrentStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const fetchAttendanceRecords = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axios.get(`/api/admin/attendance/records?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAttendanceRecords(response.data.records);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentStatus = async () => {
    setLoadingCurrentStatus(true);
    try {
      const token = localStorage.getItem('token');
      const today = new Date().toISOString().split('T')[0];
      const queryParams = new URLSearchParams();
      queryParams.append('date', today);

      const response = await axios.get(`/api/admin/attendance/records?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Assuming response.data.records contains attendance records for today
      // We need to augment with break info if available (not shown here for simplicity)
      setCurrentStatusRecords(response.data.records);
    } catch (error) {
      console.error('Error fetching current status records:', error);
    } finally {
      setLoadingCurrentStatus(false);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();

      Object.entries(reportFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axios.get(`/api/admin/attendance/reports?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: reportFilters.format === 'excel' || reportFilters.format === 'csv' ? 'blob' : 'json'
      });

      if (reportFilters.format === 'excel' || reportFilters.format === 'csv') {
        // Handle file download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `attendance-report.${reportFilters.format === 'excel' ? 'xlsx' : 'csv'}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        setReportData(response.data.report);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReportFilterChange = (key: string, value: string) => {
    setReportFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Attendance Dashboard
          </h1>
          <p className="text-gray-600">Manage and monitor employee attendance data</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="current-status">Current Status</TabsTrigger>
            <TabsTrigger value="records">Attendance Records</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="current-status" className="space-y-6">
            {/* Current Status Table */}          
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Current Attendance Status ({currentStatusRecords.length})
                </CardTitle>
                <p className="text-sm text-gray-600">Real-time attendance status for today</p>
              </CardHeader>
              <CardContent>
                {loadingCurrentStatus ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Loading current status...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Punch In</TableHead>
                      <TableHead>Punch Out</TableHead>
                      <TableHead>Total Hours</TableHead>
                      <TableHead>Break Count</TableHead>
                      <TableHead>Break Duration (mins)</TableHead>
                      <TableHead>Production Hours</TableHead>
                      <TableHead>Current Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentStatusRecords.map((record) => {
                      // Calculate break duration in minutes if available
                      const breakDuration = record.currentBreak && record.currentBreak.breakStartTime
                        ? Math.floor((new Date().getTime() - new Date(record.currentBreak.breakStartTime).getTime()) / 60000)
                        : 0;
                      // Calculate production hours = totalHours - breakDuration (converted to hours)
                      const productionHours = record.totalHours ? Math.max(0, record.totalHours - breakDuration / 60) : 0;
                      return (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{record.fullName}</div>
                              <div className="text-sm text-gray-500">{record.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{record.position}</TableCell>
                          <TableCell>{record.punchInTime ? new Date(record.punchInTime).toLocaleTimeString() : '-'}</TableCell>
                          <TableCell>{record.punchOutTime ? new Date(record.punchOutTime).toLocaleTimeString() : '-'}</TableCell>
                          <TableCell>{record.totalHours?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell>{record.currentBreak ? 1 : 0}</TableCell>
                          <TableCell>{breakDuration}</TableCell>
                          <TableCell>{productionHours.toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.punchInTime && !record.punchOutTime ? 'bg-green-100 text-green-800' :
                              record.punchInTime && record.punchOutTime ? 'bg-blue-100 text-blue-800' :
                              record.status === 'week-off' ? 'bg-gray-100 text-gray-800' :
                              record.status === 'holiday' ? 'bg-purple-100 text-purple-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {record.punchInTime && !record.punchOutTime ? 'Punched In' :
                               record.punchInTime && record.punchOutTime ? 'Punched Out' :
                               record.status === 'week-off' ? 'Week Off' :
                               record.status === 'holiday' ? 'Holiday' :
                               'Not Started'}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            {/* Filters */}          
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Filter Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Input
                    placeholder="User ID"
                    value={filters.userId}
                    onChange={(e) => handleFilterChange('userId', e.target.value)}
                  />
                  <Input
                    type="date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                  />
                  <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="half-day">Half-day</SelectItem>
                      <SelectItem value="week-off">Week-off</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
                  <Input
                    type="date"
                    placeholder="End Date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Records Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Attendance Records ({attendanceRecords.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Punch In</TableHead>
                        <TableHead>Punch Out</TableHead>
                        <TableHead>Total Hours</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{record.fullName}</div>
                              <div className="text-sm text-gray-500">{record.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>{record.punchInTime ? new Date(record.punchInTime).toLocaleTimeString() : '-'}</TableCell>
                          <TableCell>{record.punchOutTime ? new Date(record.punchOutTime).toLocaleTimeString() : '-'}</TableCell>
                          <TableCell>{record.totalHours?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.status === 'present' ? 'bg-green-100 text-green-800' :
                              record.status === 'absent' ? 'bg-red-100 text-red-800' :
                              record.status === 'half-day' ? 'bg-yellow-100 text-yellow-800' :
                              record.status === 'week-off' ? 'bg-gray-100 text-gray-800' :
                              record.status === 'holiday' ? 'bg-purple-100 text-purple-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {record.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Report Filters */}          
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Generate Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={reportFilters.startDate}
                    onChange={(e) => handleReportFilterChange('startDate', e.target.value)}
                  />
                  <Input
                    type="date"
                    placeholder="End Date"
                    value={reportFilters.endDate}
                    onChange={(e) => handleReportFilterChange('endDate', e.target.value)}
                  />
                  <Input
                    placeholder="Department"
                    value={reportFilters.department}
                    onChange={(e) => handleReportFilterChange('department', e.target.value)}
                  />
                  <Select value={reportFilters.format} onValueChange={(value) => handleReportFilterChange('format', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={generateReport} disabled={loading} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  {loading ? 'Generating...' : 'Generate Report'}
                </Button>
              </CardContent>
            </Card>

            {/* Report Data */}
            {reportData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Report Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Present</TableHead>
                          <TableHead>Half Days</TableHead>
                          <TableHead>Absent</TableHead>
                          <TableHead>Total Hours</TableHead>
                          <TableHead>Attendance %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportData.map((report, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{report.employeeName}</div>
                                <div className="text-sm text-gray-500">{report.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>{report.department}</TableCell>
                            <TableCell>{report.presentDays}</TableCell>
                            <TableCell>{report.halfDays}</TableCell>
                            <TableCell>{report.absentDays}</TableCell>
                            <TableCell>{report.totalHours?.toFixed(2)}</TableCell>
                            <TableCell>{report.attendancePercentage?.toFixed(1)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Attendance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <CalendarViewAdmin />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
