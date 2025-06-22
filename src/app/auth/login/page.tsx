'use client';

import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { useAuth } from '@/context/AuthContext';
import useTranslator from '@/hooks/useTranslator';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { login } = useAuth();
  const text = useTranslator();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = text.auth.email_required;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = text.auth.email_invalid;
    }

    if (!formData.password) {
      newErrors.password = text.auth.password_required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        router.push('/');
      } else {
        setErrors({ general: result.error || text.auth.auth_failed });
      }
    } catch (error) {
      setErrors({ general: text.auth.something_went_wrong });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      window.location.href = '/api/auth/google';
    } catch (error) {
      setErrors({ general: text.auth.google_auth_failed });
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-light-primary/10 to-light-secondary/10 dark:from-slate-800 dark:via-slate-700/20 dark:to-slate-900 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-white dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-md'
      >
        {/* Header */}
        <div className='text-center p-6 border-b border-gray-200 dark:border-gray-700'>
          <h1 className='text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-1'>
            {text.auth.welcome_back}
          </h1>
          <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
            {text.auth.sign_in_to_continue}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          <InputField
            name='email'
            type='email'
            value={formData.email}
            onChange={handleInputChange}
            placeholder='Enter your email'
            error={errors.email}
            icon={<Mail className='w-4 h-4' />}
          />

          <InputField
            name='password'
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            placeholder='Enter your password'
            error={errors.password}
            icon={<Lock className='w-4 h-4' />}
            endAdornment={
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='text-light-text-secondary dark:text-dark-text-secondary'
              >
                {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
              </button>
            }
          />

          <Button type='submit' variant='primary' className='w-full' disabled={isLoading}>
            {isLoading ? 'Loading...' : text.general.login}
          </Button>

          {errors.general && (
            <div className='text-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
              <p className='text-red-600 dark:text-red-400 text-sm'>{errors.general}</p>
            </div>
          )}

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-light-border dark:border-dark-border' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white dark:bg-dark-card text-light-text-secondary dark:text-dark-text-secondary'>
                {text.auth.or_continue_with}
              </span>
            </div>
          </div>

          <Button
            type='button'
            variant='default'
            className='w-full flex items-center justify-center gap-2'
            onClick={handleGoogleAuth}
            disabled={isLoading}
          >
            <svg className='w-4 h-4' viewBox='0 0 24 24'>
              <path
                fill='currentColor'
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              />
              <path
                fill='currentColor'
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              />
              <path
                fill='currentColor'
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
              />
              <path
                fill='currentColor'
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
              />
            </svg>
            {text.auth.continue_with_google}
          </Button>

          <div className='text-center pt-2'>
            <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
              {text.auth.dont_have_account}
              <Link
                href='/auth/signup'
                className='ml-1 text-light-primary dark:text-dark-primary hover:underline'
              >
                {text.general.sign_up}
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
