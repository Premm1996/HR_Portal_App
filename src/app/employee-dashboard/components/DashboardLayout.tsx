'use client';

import React, { useState } from 'react';
import Sidebar from '../../dashboard/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Menu, X } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex text-gray-900">
        {/* Sidebar for desktop */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
            <div className="relative">
              <Sidebar />
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col">
          {/* Compact Topbar - Reduced height */}
          <header className="bg-white p-3 flex justify-between items-center border-b border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              {/* Hamburger menu for mobile */}
              <button
                className="md:hidden text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <h1 className="text-lg font-bold text-gray-900 tracking-wide">HireConnect</h1>
              </div>
            </div>
            {/* Compact right section */}
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 hidden sm:inline">Online</span>
            </div>
          </header>
          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
