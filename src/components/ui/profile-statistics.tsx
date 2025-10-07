"use client";

import React from 'react';
import { Calendar, FileText, TrendingUp, Clock, CheckCircle, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './card';

interface ProfileStats {
  accountCreated: string | null;
  profileCompleted: number;
  documentsUploaded: number;
  lastUpdated: string | null;
  totalUpdates: number;
}

interface ProfileStatisticsProps {
  stats: ProfileStats;
  isLoading?: boolean;
}

export default function ProfileStatistics({ stats, isLoading = false }: ProfileStatisticsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-slate-700 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCompletionBg = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const statItems = [
    {
      title: 'Account Created',
      value: formatDate(stats.accountCreated),
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Profile Complete',
      value: `${stats.profileCompleted}%`,
      icon: CheckCircle,
      color: getCompletionColor(stats.profileCompleted),
      bgColor: getCompletionBg(stats.profileCompleted),
      showProgress: true
    },
    {
      title: 'Documents',
      value: stats.documentsUploaded.toString(),
      icon: FileText,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: 'Last Updated',
      value: formatDate(stats.lastUpdated),
      icon: Clock,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    },
    {
      title: 'Total Updates',
      value: stats.totalUpdates.toString(),
      icon: TrendingUp,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20'
    },
    {
      title: 'Activity Score',
      value: Math.min(Math.floor((stats.profileCompleted + (stats.documentsUploaded * 5) + stats.totalUpdates) / 10), 100).toString(),
      icon: Users,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Profile Statistics</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <Card key={index} className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${item.bgColor}`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{item.title}</p>
                    <p className={`text-lg font-semibold ${item.color}`}>
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress bar for profile completion */}
              {item.showProgress && (
                <div className="mt-3">
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getCompletionBg(stats.profileCompleted)}`}
                      style={{ width: `${stats.profileCompleted}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mt-4">
        {stats.profileCompleted < 100 && (
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full border border-yellow-500/30">
            Complete your profile to unlock more features
          </span>
        )}
        {stats.documentsUploaded === 0 && (
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full border border-blue-500/30">
            Upload documents to improve your profile
          </span>
        )}
        {stats.totalUpdates > 5 && (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
            Active profile maintainer!
          </span>
        )}
      </div>
    </div>
  );
}
