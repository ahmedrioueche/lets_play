'use client';

import LoadingPage from '@/components/ui/LoadingPage';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.replace('/auth/login');
          return;
        }
        const user = await res.json();
        console.log({ user });
        if (user.isVerified === false) {
          router.replace('/auth/email-verification');
          return;
        }
        if (user.hasCompletedOnboarding === false) {
          router.replace('/auth/onboarding');
          return;
        }
      } catch {
        router.replace('/auth/login');
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
