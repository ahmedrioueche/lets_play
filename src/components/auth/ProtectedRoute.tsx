'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      //try {
      //  const response = await fetch('/api/auth/me', {
      //    credentials: 'include',
      //  });
      //
      //  if (response.ok) {
      //    setIsAuthenticated(true);
      //  } else {
      //    setIsAuthenticated(false);
      //    router.push('/auth/login');
      //  }
      //} catch (error) {
      //  console.error('Auth check failed:', error);
      //  setIsAuthenticated(false);
      //  router.push('/auth/login');
      //} finally {
      //  setIsLoading(false);
      //}
      setIsAuthenticated(true);
    };

    checkAuth();
  }, [router]);

  // if (isLoading) {
  //   return <LoadingPage />;
  // }
  //
  // if (!isAuthenticated) {
  //   return fallback ? <>{fallback}</> : null;
  // }
  //
  return <>{children}</>;
};

export default ProtectedRoute;
