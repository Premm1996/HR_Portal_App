'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import HomePage from '@/app/employee-dashboard/[id]/home/page';

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : null;

  useEffect(() => {
    // Set admin mode and edit mode for this page
    localStorage.setItem('isAdmin', 'true');
    // Force edit mode by setting URL parameter
    if (typeof window !== 'undefined' && !window.location.search.includes('mode=edit')) {
      window.history.replaceState({}, '', `${window.location.pathname}?mode=edit`);
    }
  }, []);

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Invalid employee ID</div>
      </div>
    );
  }

  return <HomePage params={{ id }} />;
}
