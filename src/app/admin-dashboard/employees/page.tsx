'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  UserCheck,
  Clock,
  AlertCircle,
  FileText,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  status: string;
  department?: string;
  onboarding_step?: number;
  createdAt: string;
  updatedAt: string;
  offerLetterUploaded?: boolean;
  idCardGenerated?: boolean;
}

interface EmployeeStats {
  totalEmployees: number;
  completed: number;
  inProgress: number;
  notStarted: number;
}

export default function AdminEmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState<EmployeeStats>({
    totalEmployees: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, statusFilter]);

  const fetchEmployees = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const isAdmin = localStorage.getItem('isAdmin');

      console.log('🔍 Admin Employees: Token present:', !!token);
      console.log('🔍 Admin Employees: Is admin:', isAdmin);

      if (!token || isAdmin !== 'true') {
        setError('Authentication required. Please log in as an admin.');
        setLoading(false);
        return;
      }

      console.log('🔍 Admin Employees: Fetching employees...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/employees`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
          return;
        }
        throw new Error(`Failed to fetch employees: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Admin Employees: Received data:', data);

      if (data.employees) {
        setEmployees(data.employees);
        setStats(data.stats || {
          totalEmployees: data.employees.length,
          completed: data.employees.filter((e: Employee) => e.status === 'COMPLETE').length,
          inProgress: data.employees.filter((e: Employee) => e.status === 'IN_PROGRESS').length,
          notStarted: data.employees.filter((e: Employee) => e.status === 'NOT_STARTED').length
        });
      } else {
        setEmployees([]);
        setStats({
          totalEmployees: 0,
          completed: 0,
          inProgress: 0,
          notStarted: 0
        });
      }
    } catch (error) {
      console.error('❌ Admin Employees: Error fetching employees:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(employee => employee.status === statusFilter);
    }

    setFilteredEmployees(filtered);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchEmployees();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETE':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'NOT_STARTED':
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETE':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'NOT_STARTED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Total registered employees'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: UserCheck,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      description: 'Fully onboarded employees'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Employees in onboarding'
    },
    {
      title: 'Not Started',
      value: stats.notStarted,
      icon: AlertCircle,
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      description: 'Pending employee accounts'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Employee Management
            </h1>
            <p className="text-gray-600">Manage and monitor all employee accounts and onboarding progress.</p>
          </div>
          <div className="flex items-center gap-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                ⚠️ {error}
              </div>
            )}
            <Button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-lg shadow-md p-6 ${stat.bgColor} border border-gray-200`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search employees by name, email, position, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="COMPLETE">Completed</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="NOT_STARTED">Not Started</option>
                </select>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employees ({filteredEmployees.length})
              </span>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Employee
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Loading employees...</span>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all'
                    ? 'No employees match your current filters.'
                    : 'No employee records found in the system.'}
                </p>
                <Button onClick={handleRefresh} className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh Data
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Documents
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEmployees.map((employee, index) => (
                      <motion.tr
                        key={employee.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {employee.firstName} {employee.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {employee.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.email}</div>
                          {employee.phone && (
                            <div className="text-sm text-gray-500">{employee.phone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.position || 'N/A'}</div>
                          {employee.department && (
                            <div className="text-sm text-gray-500">{employee.department}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                            {getStatusIcon(employee.status)}
                            <span className="ml-1 capitalize">
                              {employee.status.toLowerCase().replace('_', ' ')}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {employee.offerLetterUploaded ? (
                              <div className="flex items-center text-green-600">
                                <FileText className="w-4 h-4" />
                                <span className="text-xs ml-1">Offer</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-gray-400">
                                <FileText className="w-4 h-4" />
                                <span className="text-xs ml-1">No Offer</span>
                              </div>
                            )}
                            {employee.idCardGenerated ? (
                              <div className="flex items-center text-blue-600">
                                <Users className="w-4 h-4" />
                                <span className="text-xs ml-1">ID Card</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-gray-400">
                                <Users className="w-4 h-4" />
                                <span className="text-xs ml-1">No ID</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(employee.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/admin-dashboard/employees/${employee.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/employee-dashboard/${employee.id}/home?mode=view`)}>
                                <Users className="mr-2 h-4 w-4" />
                                View Employee Dashboard
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/employee-dashboard/${employee.id}/home?mode=edit`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Employee Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Employee
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
