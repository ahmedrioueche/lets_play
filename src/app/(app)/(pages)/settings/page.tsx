'use client';

import Button from '@/components/ui/Button';
import useTranslator from '@/hooks/useTranslator';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import SettingsPreferences from './components/SettingsPreferences';

const SettingsPage: React.FC = () => {
  const text = useTranslator();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(text.settings.saved || 'Settings saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

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

        <Button
          onClick={handleSave}
          variant='primary'
          className='px-6 sm:px-8 py-2 sm:py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200'
          disabled={loading}
        >
          {loading ? (
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
              Saving...
            </div>
          ) : (
            text.settings.save || 'Save Preferences'
          )}
        </Button>
      </div>

      {/* Settings Content */}
      <SettingsPreferences />
    </div>
  );
};

export default SettingsPage;
