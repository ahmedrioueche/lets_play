'use client';
import LoadingPage from '@/components/ui/LoadingPage';
import { useAuth } from '@/context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import AgeStep from './components/AgeStep';
import FavoriteSportsStep from './components/FavoriteSportsStep';
import LocationStep from './components/LocationStep';
import ReviewStep from './components/ReviewStep';

interface OnboardingData {
  age: string;
  location: { lat: number; lng: number; address?: string } | null;
  favoriteSports: string[];
}

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    age: '',
    location: null,
    favoriteSports: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Check authentication on mount
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.replace('/auth/login');
          return;
        }
        const user = await res.json();
        if (user && user.hasCompletedOnboarding) {
          router.replace('/');
          return;
        }
      } catch {
        router.replace('/auth/login');
        return;
      }
      setAuthLoading(false);
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [success, router]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Update core user fields
      const resUser = await fetch(`/api/users/${user?._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: onboardingData.age,
          location: onboardingData.location
            ? {
                cords: { lat: onboardingData.location.lat, lng: onboardingData.location.lng },
                address:
                  onboardingData.location.address ||
                  `Lat: ${onboardingData.location.lat}, Lng: ${onboardingData.location.lng}`,
              }
            : null,
          hasCompletedOnboarding: true,
        }),
      });
      if (!resUser.ok) throw new Error('Failed to save user onboarding data');
      // Update UserProfile fields
      const resProfile = await fetch(`/api/users/${user?._id}/user-profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          favoriteSports: onboardingData.favoriteSports,
        }),
      });
      if (!resProfile.ok) throw new Error('Failed to save user profile onboarding data');
      setIsLoading(false);
      setSuccess(true);
    } catch (err) {
      setIsLoading(false);
      setError('Something went wrong. Please try again.');
    }
  };

  const steps = [
    {
      component: (
        <AgeStep
          value={onboardingData.age}
          onChange={(age: string) => setOnboardingData((prev) => ({ ...prev, age }))}
          onNext={() => setStep(step + 1)}
        />
      ),
    },
    {
      component: (
        <LocationStep
          value={onboardingData.location}
          onChange={(location: { lat: number; lng: number }) =>
            setOnboardingData((prev) => ({ ...prev, location }))
          }
          onNext={() => setStep(step + 1)}
          onBack={() => setStep(step - 1)}
        />
      ),
    },
    {
      component: (
        <FavoriteSportsStep
          value={onboardingData.favoriteSports}
          onChange={(favoriteSports: string[]) =>
            setOnboardingData((prev) => ({ ...prev, favoriteSports }))
          }
          onNext={() => setStep(step + 1)}
          onBack={() => setStep(step - 1)}
        />
      ),
    },
    {
      component: (
        <ReviewStep
          data={onboardingData}
          onSubmit={handleSubmit}
          onBack={() => setStep(step - 1)}
          isLoading={isLoading}
        />
      ),
    },
  ];

  if (authLoading) {
    return <LoadingPage />;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-light-primary/10 to-light-secondary/10 dark:from-slate-800 dark:via-slate-700/20 dark:to-slate-900 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-light-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-md'
      >
        <AnimatePresence mode='wait'>
          {success ? (
            <motion.div
              key='success'
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className='p-8 flex flex-col items-center'
            >
              <Image
                src='/images/welcome.svg'
                alt='Welcome'
                width={160}
                height={160}
                className='mb-4 drop-shadow-lg'
              />
              <h2 className='text-3xl font-bold mb-2 text-light-text-primary dark:text-dark-text-primary'>
                Welcome!
              </h2>
              <p className='text-light-text-secondary dark:text-dark-text-secondary mb-4 text-center'>
                Your onboarding is complete. Enjoy the app!
              </p>
              <span className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                Redirecting...
              </span>
            </motion.div>
          ) : (
            <motion.div key={step} exit={{ opacity: 0, x: -40 }}>
              {error && <div className='text-red-500 text-sm mb-4 text-center'>{error}</div>}
              {steps[step].component}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
