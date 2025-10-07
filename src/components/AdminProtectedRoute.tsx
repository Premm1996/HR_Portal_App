'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const isAdmin = localStorage.getItem('isAdmin');

      if (token && isAdmin === 'true') {
        setIsAuthorized(true);
      } else {
        router.push('/signin');
      }
      setIsLoading(false);
    };

    // Add a small delay to ensure localStorage is properly set
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
