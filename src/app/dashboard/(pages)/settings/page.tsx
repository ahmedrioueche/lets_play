'use client';

import useTranslator from '@/hooks/useTranslator';
import React from 'react';
import SettingsPreferences from './components/SettingsPreferences';

const SettingsPage: React.FC = () => {
  const text = useTranslator();

  return (
    <div className='space-y-6 sm:space-y-8 p-2 sm:p-4 md:p-2'>
      {/* Page Title with Save Button */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold font-dancing text-gray-900 dark:text-white'>
              {text.settings.title}
            </h1>
            <p className='text-gray-600 dark:text-gray-300 mt-1'>
              Manage your preferences and account settings
            </p>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <SettingsPreferences />
    </div>
  );
};

export default SettingsPage;
