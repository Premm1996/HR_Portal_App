'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [canProceed, setCanProceed] = useState(true);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        authService.logout();
        return;
      }

      const canProceed = await authService.canProceed();
      const retryMessage = await authService.getRetryMessage();

      setCanProceed(canProceed);
      setRetryMessage(retryMessage);
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

  if (!canProceed && retryMessage) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-red-600 text-white p-8 rounded-lg text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Interview Failed</h2>
          <p className="text-lg mb-4">{retryMessage}</p>
          <button 
            onClick={() => authService.logout()}
            className="px-4 py-2 bg-white text-red-600 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
