'use client';

import Loading from '@/components/ui/Loading';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?._id) {
      router.replace(`/profile/${user._id}`);
    }
  }, [user?._id, router]);

  // Show loading while redirecting
  return <Loading />;
}
