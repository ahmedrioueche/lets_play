import Checkbox from '@/components/ui/Checkbox';
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
        <Checkbox
          id='pushNotifications'
          checked={pushNotifications}
          onChange={onPushNotificationsChange}
          label={text.settings.push_notifications || 'Push Notifications'}
          description='Receive notifications about new games'
          accentColor='green'
        />
        <Checkbox
          id='emailNotifications'
          checked={emailNotifications}
          onChange={onEmailNotificationsChange}
          label={text.settings.email_notifications || 'Email Notifications'}
          description='Receive email updates about activities'
          accentColor='green'
        />
      </div>
    </div>
  );
};

export default NotificationsSection;
