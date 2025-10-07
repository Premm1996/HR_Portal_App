'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../lib/auth';

interface CandidateDashboardGuardProps {
  children: React.ReactNode;
}

export default function CandidateDashboardGuard({ children }: CandidateDashboardGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
          router.push('/login');
          return;
        }

        // Check if candidate can access dashboard
        const hasAccess = await authService.canAccessDashboard();
        
        if (hasAccess) {
          setCanAccess(true);
        } else {
          // Get redirect path based on current progress
          const redirectPath = await authService.getRedirectPath();
          router.push(redirectPath);
        }
      } catch (error) {
        console.error('Error checking dashboard access:', error);
        router.push('/candidate-onboarding');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!canAccess) {
    return null; // Will be redirected by the useEffect
  }

  return <>{children}</>;
}
