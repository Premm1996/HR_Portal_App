'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Calendar,
  Download,
} from 'lucide-react';

export default function AdminAnalytics() {
  const router = useRouter();
  interface AnalyticsData {
    totalEmployees?: number;
    employeeGrowth: { month: string; count: number }[];
    offerLetters?: {
      total: number;
    };
    onboardingProgress?: {
      completed: number;
    };
    attendanceRate?: number;
    attendanceOverview?: {
      checkedIn: number;
      noShow: number;
      checkInDelay: number;
    };
  }

  const [analytics, setAnalytics] = useState<AnalyticsData>({
    employeeGrowth: [],
    offerLetters: {
      total: 0,
    },
    onboardingProgress: {
      completed: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin');
    if (!token || isAdmin !== 'true') {
      router.push('/signin');
      return;
    }
    fetchAnalytics();
  }, [router]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Analytics data received:', data);
        setAnalytics(data);
      } else {
        console.error('Failed to fetch analytics:', response.status, response.statusText);
        // Set default values if API fails
        setAnalytics({
          employeeGrowth: [],
          offerLetters: { total: 0 },
          onboardingProgress: { completed: 0 }
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set default values if API fails
      setAnalytics({
        employeeGrowth: [],
        offerLetters: { total: 0 },
        onboardingProgress: { completed: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-2xl font-bold">Analytics Dashboard</h1>
        <button className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded">
          <Download className="w-5 h-5" />
          <span>Export Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Employees</p>
              <p className="text-white text-2xl font-bold">{analytics.totalEmployees || 0}</p>
            </div>
            <Users className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Offer Letters Issued</p>
              <p className="text-white text-2xl font-bold">{analytics.offerLetters?.total || 0}</p>
            </div>
            <FileText className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Attendance Rate</p>
              <p className="text-white text-2xl font-bold">{analytics.attendanceRate || 0}%</p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Onboarding Completion</p>
              <p className="text-white text-2xl font-bold">{analytics.onboardingProgress?.completed || 0}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h2 className="text-white text-xl font-semibold mb-4">Employee Growth</h2>
          <div className="space-y-2">
            {analytics.employeeGrowth.map((month, index) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="text-slate-300 w-20">{month.month}</span>
                <div className="flex-1 bg-slate-700 rounded-full h-4">
                  <div
                    className="bg-cyan-400 h-4 rounded-full"
                    style={{ width: `${(month.count / 10) * 100}%` }}
                  ></div>
                </div>
                <span className="text-white">{month.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h2 className="text-white text-xl font-semibold mb-4">Attendance Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-300">Checked In</span>
              <span className="text-green-400">{analytics.attendanceOverview?.checkedIn || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">No Show</span>
              <span className="text-red-400">{analytics.attendanceOverview?.noShow || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Check in Delay</span>
              <span className="text-yellow-400">{analytics.attendanceOverview?.checkInDelay || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
