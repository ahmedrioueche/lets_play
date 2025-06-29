import { UserProfile } from '@/types/user';
import { useCallback, useEffect, useState } from 'react';

export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch user profile');
      const data = await res.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refresh: fetchProfile };
}
