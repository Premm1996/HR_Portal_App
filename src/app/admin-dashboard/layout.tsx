'use client';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import AdminSidebar from '../admin/components/AdminSidebar';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProtectedRoute>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </AdminProtectedRoute>
  );
}
