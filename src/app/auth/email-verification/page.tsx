'use client';
import LoadingPage from '@/components/ui/LoadingPage';
import useTranslator from '@/hooks/useTranslator';
import { User } from '@/types/user';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import EmailVerificationForm from './components/EmailVerificationForm';

const EmailVerificationPage: React.FC = () => {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [sentOnLoad, setSentOnLoad] = useState(false);
  const router = useRouter();
  const t = useTranslator();

  useEffect(() => {
    // Fetch user email
    const fetchEmail = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.replace('/auth/login');
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch {
        router.replace('/auth/login');
        return;
      }
      setIsLoading(false);
    };
    fetchEmail();
  }, [router]);

  // Send code automatically when email is loaded
  useEffect(() => {
    if (!isLoading && user && user.email && !sentOnLoad) {
      handleResend();
      setSentOnLoad(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, user?.email]);

  const handleSubmit = async (otp: string) => {
    setOtpLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });
      if (!res.ok) throw new Error('Invalid code');
      // On success, redirect to onboarding or home
      if (user?.hasCompletedOnboarding) router.replace('/');
      else router.replace('/auth/onboarding');
    } catch (err) {
      setError(t.auth.email_verification_invalid_code);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/send-verification', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to send code');
    } catch {
      setError(t.auth.email_verification_failed_send);
    } finally {
      setResendLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      {/* Background Elements */}
      <div className='absolute inset-0 opacity-30 animate-pulse pointer-events-none'>
        <div className='absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl' />
        <div className='absolute top-40 right-20 w-24 h-24 bg-purple-400/20 rounded-full blur-xl' />
        <div className='absolute bottom-20 left-1/4 w-40 h-40 bg-pink-400/20 rounded-full blur-xl' />
      </div>
      <div className='bg-light-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-md'>
        <EmailVerificationForm
          email={user?.email!}
          onSubmit={handleSubmit}
          isLoading={otpLoading}
          error={error}
          onResend={handleResend}
          resendLoading={resendLoading}
        />
      </div>
    </div>
  );
};

export default EmailVerificationPage;
