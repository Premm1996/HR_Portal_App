'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  FileText,
  CreditCard,
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  LogOut,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  IdCard,
  RotateCcw,
  CheckSquare,
  UserCheck,
  BarChart3,
  Settings,
  Calendar,
  HelpCircle
} from 'lucide-react';

interface Employee {
  id: number;
  fullName: string;
  email: string;
  onboardingStatus: string;
  onboardingStep: number;
  createdAt: string;
  offerLetterUploaded: boolean;
  idCardGenerated: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    totalEmployees: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0
  });

  useEffect(() => {
    // Check authentication and admin role
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin');

    if (!token || isAdmin !== 'true') {
      router.push('/signin');
      return;
    }

    // Fetch admin data
    fetchEmployees();
  }, [router]);

  useEffect(() => {
    // Filter employees based on search and status
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(employee => employee.onboardingStatus === statusFilter);
    }

    setFilteredEmployees(filtered);
  }, [employees, searchTerm, statusFilter]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard data received:', data);
        setEmployees(data.employees || []);
        setStats(data.stats || { totalEmployees: 0, completed: 0, inProgress: 0, notStarted: 0 });
      } else {
        console.error('Failed to fetch employees:', response.status, response.statusText);
        // Set default values if API fails
        setEmployees([]);
        setStats({ totalEmployees: 0, completed: 0, inProgress: 0, notStarted: 0 });
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      // Set default values if API fails
      setEmployees([]);
      setStats({ totalEmployees: 0, completed: 0, inProgress: 0, notStarted: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/signin');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETE': return 'text-green-400';
      case 'IN_PROGRESS': return 'text-yellow-400';
      case 'NOT_STARTED': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETE': return <CheckCircle className="w-4 h-4" />;
      case 'IN_PROGRESS': return <Clock className="w-4 h-4" />;
      case 'NOT_STARTED': return <AlertCircle className="w-4 h-4" />;
      default: return null;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">Admin Dashboard</h1>
                <p className="text-slate-400 text-sm">HireConnect Portal Management</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Employees</p>
                <p className="text-white text-2xl font-bold">{stats.totalEmployees}</p>
              </div>
              <Users className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Completed</p>
                <p className="text-green-400 text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">In Progress</p>
                <p className="text-yellow-400 text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Not Started</p>
                <p className="text-red-400 text-2xl font-bold">{stats.notStarted}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/admin/add-employee" className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors cursor-pointer block">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Add New Employee</h3>
                <p className="text-slate-400 text-sm">Create new employee profile</p>
              </div>
            </div>
          </Link>
          <Link href="/admin/reports" className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors cursor-pointer block">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Generate Reports</h3>
                <p className="text-slate-400 text-sm">Export onboarding analytics</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Employees Table */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white font-semibold text-xl">Employees</h2>
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="all">All Status</option>
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETE">Completed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-600">
                <th className="pb-3 text-slate-400 font-medium">Name</th>
                <th className="pb-3 text-slate-400 font-medium">Email</th>
                <th className="pb-3 text-slate-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="border-b border-slate-700/50">
                  <td className="py-4 text-white">{employee.fullName}</td>
                  <td className="py-4 text-slate-300">{employee.email}</td>
                  <td className="py-4">
                    <div className="space-y-1">
                      <div className={`flex items-center space-x-2 ${getStatusColor(employee.onboardingStatus)}`}>
                        {getStatusIcon(employee.onboardingStatus)}
                        <span>{employee.onboardingStatus ? employee.onboardingStatus.replace('_', ' ') : 'Unknown'}</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {employee.offerLetterUploaded ? '✓ Offer Letter' : '✗ No Offer Letter'}
                      </div>
                      <div className="text-xs text-slate-400">
                        Email: {employee.email}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              No employees found matching your criteria.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
