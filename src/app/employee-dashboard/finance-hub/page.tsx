'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '../../../lib/auth';

export default function FinanceHubPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (!AuthService.isAuthenticated()) {
        router.push('/signin');
        return;
      }

      const employeeId = AuthService.getCurrentEmployeeId();
      if (employeeId) {
        router.push(`/employee-dashboard/${employeeId}/finance`);
      } else {
        // If no employeeId, redirect to signin
        router.push('/signin');
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
}
