import useTranslator from '@/hooks/useTranslator';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import AccessibilitySection from './AccessibilitySection';
import DisplayLanguageSection from './DisplayLanguageSection';
import NotificationsSection from './NotificationsSection';
import PrivacySecuritySection from './PrivacySecuritySection';

const SettingsPreferences: React.FC = () => {
  const text = useTranslator();
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('system');
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [privacy, setPrivacy] = useState('friends');
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [accessibility, setAccessibility] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    toast.success(`Language changed to ${value === 'en' ? 'English' : 'العربية'}`);
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    toast.success(`Theme changed to ${value}`);
  };

  const handlePrivacyChange = (value: string) => {
    setPrivacy(value);
    toast.success(`Privacy set to ${value}`);
  };

  const handleProfileVisibilityChange = (value: string) => {
    setProfileVisibility(value);
    toast.success(`Profile visibility set to ${value}`);
  };

  return (
    <div className='space-y-4 sm:space-y-6 lg:space-y-8'>
      {/* Settings Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8'>
        <DisplayLanguageSection
          language={language}
          theme={theme}
          onLanguageChange={handleLanguageChange}
          onThemeChange={handleThemeChange}
        />

        <NotificationsSection
          pushNotifications={pushNotifications}
          emailNotifications={emailNotifications}
          onPushNotificationsChange={setPushNotifications}
          onEmailNotificationsChange={setEmailNotifications}
        />

        <PrivacySecuritySection
          privacy={privacy}
          profileVisibility={profileVisibility}
          onPrivacyChange={handlePrivacyChange}
          onProfileVisibilityChange={handleProfileVisibilityChange}
        />

        <AccessibilitySection
          accessibility={accessibility}
          highContrast={highContrast}
          largeText={largeText}
          onAccessibilityChange={setAccessibility}
          onHighContrastChange={setHighContrast}
          onLargeTextChange={setLargeText}
        />
      </div>
    </div>
  );
};

export default SettingsPreferences;
