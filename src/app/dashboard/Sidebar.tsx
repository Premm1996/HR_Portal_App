'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import authService from '../../lib/auth';
import {
  Home,
  Calendar,
  FileText,
  CheckSquare,
  Clock,
  User,
  FileCheck,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  DollarSign,
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = authService.getCurrentEmployeeId();
    setEmployeeId(id);
    setLoading(false);
  }, []);

  // If no employeeId after loading, show disabled state
  if (!loading && !employeeId) {
    return (
      <aside className="w-64 bg-white text-gray-900 min-h-screen p-6 flex flex-col border-r border-gray-300 rounded-3xl shadow-sm">
        <div className="flex justify-center items-center flex-grow">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mb-4"></div>
            <p className="text-gray-500 text-sm">Unable to load employee ID</p>
            <p className="text-gray-400 text-xs mt-2">Please refresh or contact support</p>
          </div>
        </div>
      </aside>
    );
  }

  if (loading) {
    return (
      <aside className="w-64 bg-white text-gray-900 min-h-screen p-6 flex flex-col border-r border-gray-300 rounded-3xl shadow-sm">
        <div className="flex justify-center items-center flex-grow">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
        </div>
      </aside>
    );
  }

  const navigation = [
    { name: 'Home', href: `/employee-dashboard/${employeeId}/home`, icon: Home },
    { name: 'Attendance', href: `/employee-dashboard/${employeeId}/attendance`, icon: Calendar },
    { name: 'My Documents', href: `/employee-dashboard/${employeeId}/documents`, icon: FileText },
    { name: 'Onboarding Tasks', href: `/employee-dashboard/${employeeId}/onboarding`, icon: CheckSquare },
    { name: 'Schedule', href: `/employee-dashboard/${employeeId}/schedule`, icon: Clock },
    { name: 'Finance Hub', href: `/employee-dashboard/${employeeId}/finance-hub`, icon: DollarSign },
    { name: 'Payslips', href: `/employee-dashboard/${employeeId}/payslips`, icon: FileCheck },
    { name: 'Notifications', href: `/employee-dashboard/${employeeId}/notifications`, icon: Bell },
    { name: 'Support', href: `/employee-dashboard/${employeeId}/support`, icon: HelpCircle },
    { name: 'Settings', href: `/employee-dashboard/${employeeId}/settings`, icon: Settings },
  ];

  const isActive = (href: string) => pathname?.startsWith(href) || false;

  return (
    <aside className="w-64 bg-white text-gray-900 min-h-screen p-6 flex flex-col border-r border-gray-300 rounded-3xl shadow-sm">
      {/* Logo */}
      <div className="flex items-center mb-10 space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-lg">E</span>
        </div>
        <div>
          <span className="text-xl font-semibold tracking-wide text-gray-900">Employee Portal</span>
          <p className="text-gray-500 text-xs">HireConnect</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive(item.href) ? 'text-white' : 'text-gray-700'}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto">
        <button
          onClick={() => authService.logout()}
          className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
