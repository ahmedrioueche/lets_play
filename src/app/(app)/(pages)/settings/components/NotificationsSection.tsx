import useTranslator from '@/hooks/useTranslator';
import React from 'react';

interface NotificationsSectionProps {
  pushNotifications: boolean;
  emailNotifications: boolean;
  onPushNotificationsChange: (value: boolean) => void;
  onEmailNotificationsChange: (value: boolean) => void;
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  pushNotifications,
  emailNotifications,
  onPushNotificationsChange,
  onEmailNotificationsChange,
}) => {
  const text = useTranslator();

  return (
    <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden'>
      <div className='px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-green-200/50 dark:border-green-700/50'>
        <h3 className='font-semibold text-green-900 dark:text-green-100 flex items-center gap-2'>
          <span className='w-2 h-2 bg-green-500 rounded-full'></span>
          {text.settings.notifications || 'Notifications'}
        </h3>
      </div>
      <div className='p-4 sm:p-6 space-y-3 sm:space-y-4'>
        <div className='flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'>
          <div>
            <label
              htmlFor='pushNotifications'
              className='text-gray-900 dark:text-gray-100 font-medium cursor-pointer'
            >
              {text.settings.push_notifications || 'Push Notifications'}
            </label>
            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
              Receive notifications about new games
            </p>
          </div>
          <input
            id='pushNotifications'
            type='checkbox'
            checked={pushNotifications}
            onChange={(e) => onPushNotificationsChange(e.target.checked)}
            className='accent-green-500 w-5 h-5 rounded focus:ring-2 focus:ring-green-500 transition-all'
          />
        </div>

        <div className='flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'>
          <div>
            <label
              htmlFor='emailNotifications'
              className='text-gray-900 dark:text-gray-100 font-medium cursor-pointer'
            >
              {text.settings.email_notifications || 'Email Notifications'}
            </label>
            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
              Receive email updates about activities
            </p>
          </div>
          <input
            id='emailNotifications'
            type='checkbox'
            checked={emailNotifications}
            onChange={(e) => onEmailNotificationsChange(e.target.checked)}
            className='accent-green-500 w-5 h-5 rounded focus:ring-2 focus:ring-green-500 transition-all'
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationsSection;
