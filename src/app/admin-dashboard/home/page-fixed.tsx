'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  UserCheck,
  Clock,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Calendar,
  FileText,
  Settings,
  Eye,
  Plus,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

interface EmployeeStats {
  totalEmployees: number;
  completed: number;
  inProgress: number;
  notStarted: number;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  employeeName: string;
}

export default function AdminDashboardHome() {
  const router = useRouter();
  const [stats, setStats] = useState<EmployeeStats>({
    totalEmployees: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    fetchStats();
    fetchRecentActivities();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Admin Dashboard: Fetching stats with token:', token ? 'Present' : 'Missing');

      const response = await fetch('/api/admin/employees/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Admin Dashboard: Stats response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Admin Dashboard: Failed to fetch stats:', errorText);
        throw new Error(`Failed to fetch stats: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📦 Admin Dashboard: Stats data received:', data);

      setStats(data);
      setDebugInfo(`✅ Stats loaded successfully. Total: ${data.totalEmployees}, Completed: ${data.completed}`);
    } catch (error) {
      console.error('❌ Admin Dashboard: Error fetching stats:', error);
      setDebugInfo(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Admin Dashboard: Fetching recent activities');

      const response = await fetch('/api/admin/employees?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Admin Dashboard: Activities response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Admin Dashboard: Failed to fetch activities:', errorText);
        throw new Error(`Failed to fetch recent activities: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📦 Admin Dashboard: Activities data received:', data);

      // Transform employees data to recent activities
      const activities = data.employees?.slice(0, 5).map((employee: any) => ({
        id: employee.id,
        type: 'employee_created',
        description: `${employee.firstName} ${employee.lastName} created account`,
        timestamp: employee.createdAt,
        employeeName: `${employee.firstName} ${employee.lastName}`
      })) || [];

      console.log('✅ Admin Dashboard: Activities transformed:', activities);
      setRecentActivities(activities);
    } catch (error) {
      console.error('❌ Admin Dashboard: Error fetching recent activities:', error);
      setDebugInfo(prev => `${prev}\n❌ Activities Error: ${error.message}`);
    }
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

  const quickActions = [
    {
      title: 'Manage Employees',
      description: 'View, edit, and manage all employee accounts',
      icon: Users,
      action: () => router.push('/admin-dashboard/employees'),
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'View Attendance',
      description: 'Monitor employee attendance records',
      icon: Calendar,
      action: () => router.push('/admin-dashboard/attendance'),
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'Notifications',
      description: 'Send and manage system notifications',
      icon: FileText,
      action: () => router.push('/admin-dashboard/notifications'),
      color: 'from-purple-600 to-purple-700'
    },
    {
      title: 'Reports',
      description: 'Generate detailed reports and analytics',
      icon: BarChart3,
      action: () => router.push('/admin-dashboard/attendance?tab=reports'),
      color: 'from-orange-600 to-orange-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your employee management system.</p>
          {debugInfo && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
              <strong>Debug Info:</strong>
              <pre className="whitespace-pre-wrap text-xs mt-2">{debugInfo}</pre>
            </div>
          )}
        </div>

        {/* Employee Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-lg shadow-md p-6 ${stat.bgColor} border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer`}
                onClick={() => router.push('/admin-dashboard/employees')}
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
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600">Active</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                        onClick={action.action}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                            <div className="mt-3">
                              <Button size="sm" className="text-xs">
                                <Eye className="w-3 h-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                        className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => router.push('/admin-dashboard/employees')}
                      >
                        <div className="p-2 rounded-full bg-blue-100">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                            {new Date(activity.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent employee activity</p>
                    <p className="text-xs text-gray-400 mt-2">Check if employees exist in the database</p>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/admin-dashboard/employees')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View All Employees
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* System Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                System Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700 mb-2">{stats.totalEmployees}</div>
                  <p className="text-sm font-medium text-blue-700">Total Accounts Created</p>
                  <p className="text-xs text-blue-600 mt-1">Employee registrations</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                  <div className="text-2xl font-bold text-green-700 mb-2">
                    {stats.completed + stats.inProgress}
                  </div>
                  <p className="text-sm font-medium text-green-700">Active Employees</p>
                  <p className="text-xs text-green-600 mt-1">Completed + In Progress</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200">
                  <div className="text-2xl font-bold text-orange-700 mb-2">
                    {stats.totalEmployees > 0 ? Math.round(((stats.completed + stats.inProgress) / stats.totalEmployees) * 100) : 0}%
                  </div>
                  <p className="text-sm font-medium text-orange-700">Completion Rate</p>
                  <p className="text-xs text-orange-600 mt-1">Active vs Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
