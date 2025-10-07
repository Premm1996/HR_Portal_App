'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Download,
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Filter,
  Calendar,
  Building,
  Search
} from 'lucide-react';

interface ReportData {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
  };
  employees: Array<{
    id: number;
    fullName: string;
    email: string;
    department: string;
    onboardingStatus: string;
    joiningDate: string;
    createdAt: string;
  }>;
}

export default function AdminReports() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReportData | null>(null);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin');
    if (!token || isAdmin !== 'true') {
      router.push('/signin');
      return;
    }
    fetchReports();
  }, [router, filters]);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      if (filters.department) queryParams.append('department', filters.department);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);

      const response = await fetch(`/api/admin/reports?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const reportData = await response.json();
        setData(reportData);
      } else {
        console.error('Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({ format });
      if (filters.department) queryParams.append('department', filters.department);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);

      const response = await fetch(`/api/admin/reports/export?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `onboarding-report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to export report');
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Error exporting report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl font-bold">Onboarding Reports</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              <FileText className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6">
          <h2 className="text-white text-xl font-semibold mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-300 text-sm mb-2">Department</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">All Status</option>
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETE">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-2">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-2">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Employees</p>
                  <p className="text-white text-2xl font-bold">{data.stats.total}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Completed</p>
                  <p className="text-green-400 text-2xl font-bold">{data.stats.completed}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">In Progress</p>
                  <p className="text-yellow-400 text-2xl font-bold">{data.stats.inProgress}</p>
                </div>
                <PieChart className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Not Started</p>
                  <p className="text-red-400 text-2xl font-bold">{data.stats.notStarted}</p>
                </div>
                <Calendar className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </div>
        )}

        {/* Employees Table */}
        {data && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h2 className="text-white text-xl font-semibold mb-4">Employee Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="pb-3 text-slate-400 font-medium">Name</th>
                    <th className="pb-3 text-slate-400 font-medium">Email</th>
                    <th className="pb-3 text-slate-400 font-medium">Department</th>
                    <th className="pb-3 text-slate-400 font-medium">Status</th>
                    <th className="pb-3 text-slate-400 font-medium">Joining Date</th>
                    <th className="pb-3 text-slate-400 font-medium">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {data.employees.map((employee) => (
                    <tr key={employee.id} className="border-b border-slate-700/50">
                      <td className="py-4 text-white">{employee.fullName}</td>
                      <td className="py-4 text-slate-300">{employee.email}</td>
                      <td className="py-4 text-slate-300">{employee.department}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          employee.onboardingStatus === 'COMPLETE' ? 'bg-green-600 text-white' :
                          employee.onboardingStatus === 'IN_PROGRESS' ? 'bg-yellow-600 text-white' :
                          'bg-red-600 text-white'
                        }`}>
                          {employee.onboardingStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 text-slate-300">{new Date(employee.joiningDate).toLocaleDateString()}</td>
                      <td className="py-4 text-slate-300">{new Date(employee.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
