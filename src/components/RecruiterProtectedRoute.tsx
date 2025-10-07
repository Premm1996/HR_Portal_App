'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

// Helper to decode JWT and get user info
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/admin-login');
        setLoading(false);
        return;
      }
      const payload = parseJwt(token);
      // Allow recruiter or admin
      if (payload && (payload.role === 'admin' || payload.role === 'recruiter')) {
        setIsAuthorized(true);
      } else {
        router.replace('/admin-login');
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
