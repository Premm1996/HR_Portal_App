'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import auth from '@/lib/auth';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Calendar,
  FileText,
  HelpCircle,
  LogOut,
  UserCheck,
  DollarSign
} from 'lucide-react';

const AdminSidebar = () => {
  const pathname = usePathname();

  const navigation = [
    { name: 'Admin Home', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Employees', href: '/admin/employees', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Finance Hub', href: '/admin/finance', icon: DollarSign },
    { name: 'Attendance', href: '/admin/attendance', icon: Calendar },
    { name: 'Documents', href: '/admin/documents', icon: FileText },
    { name: 'Support', href: '/admin/support', icon: HelpCircle },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 flex flex-col border-r border-slate-700">
      {/* Logo */}
      <div className="flex items-center mb-10 space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">H</span>
        </div>
        <div>
          <span className="text-xl font-semibold">HireConnect</span>
          <p className="text-slate-400 text-xs">Admin Portal</p>
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
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto">
        <button
          onClick={() => auth.logout()}
          className="flex items-center space-x-3 px-4 py-3 w-full text-left text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
