import { useSettings } from '@/context/SettingsContext';
import { Language } from '@/types/general';
import { useTheme } from 'next-themes';
import React from 'react';
import DisplayLanguageSection from './DisplayLanguageSection';
import NotificationsSection from './NotificationsSection';
import PreferencesSection from './PreferencesSection';
import PrivacySecuritySection from './PrivacySecuritySection';

const SettingsPreferences: React.FC = () => {
  const settingsContext = useSettings();
  const { theme, setTheme } = useTheme();

  // Handlers that update context and persist immediately
  const handleLanguageChange = (value: string) => {
    settingsContext.setSettings({ language: value as Language });
  };
  const handleThemeChange = (value: string) => {
    setTheme(value);
    settingsContext.setSettings({ theme: value });
  };
  const handlePushNotificationsChange = (value: boolean) => {
    settingsContext.setSettings({ pushNotifications: value });
  };
  const handleEmailNotificationsChange = (value: boolean) => {
    settingsContext.setSettings({ emailNotifications: value });
  };
  const handlePrivacyChange = (value: string) => {
    settingsContext.setSettings({ privacy: value });
  };
  const handleProfileVisibilityChange = (value: string) => {
    settingsContext.setSettings({ profileVisibility: value });
  };
  const handleMaxDistanceChange = (value: number) => {
    settingsContext.setSettings({ maxDistanceForVisibleGames: value });
  };
  const handleAlertBeforeChange = (value: boolean) => {
    settingsContext.setSettings({ alertBeforeGameStarts: value });
  };
  const handleAlertTimeChange = (value: number) => {
    settingsContext.setSettings({ alertTimeBeforeGame: value });
  };
  const handleAlertOnStartChange = (value: boolean) => {
    settingsContext.setSettings({ alertOnStart: value });
  };
  const handleAllowDirectGameInvitesChange = (value: boolean) => {
    settingsContext.setSettings({ allowDirectGameInvites: value });
  };
  const handleAllowMessagesFromNonFriendsChange = (value: boolean) => {
    settingsContext.setSettings({ allowMessagesFromNonFriends: value });
  };

  return (
    <div className='space-y-4 sm:space-y-6 lg:space-y-8'>
      {/* Settings Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8'>
        <DisplayLanguageSection
          language={settingsContext.language as Language}
          theme={theme || settingsContext.theme || 'light'}
          onLanguageChange={handleLanguageChange}
          onThemeChange={handleThemeChange}
        />

        <NotificationsSection
          pushNotifications={settingsContext.pushNotifications}
          emailNotifications={settingsContext.emailNotifications}
          onPushNotificationsChange={handlePushNotificationsChange}
          onEmailNotificationsChange={handleEmailNotificationsChange}
        />

        <PrivacySecuritySection
          privacy={settingsContext.privacy}
          profileVisibility={settingsContext.profileVisibility}
          onPrivacyChange={handlePrivacyChange}
          onProfileVisibilityChange={handleProfileVisibilityChange}
          allowDirectGameInvites={settingsContext.allowDirectGameInvites}
          setAllowDirectGameInvites={handleAllowDirectGameInvitesChange}
          allowMessagesFromNonFriends={settingsContext.allowMessagesFromNonFriends}
          setAllowMessagesFromNonFriends={handleAllowMessagesFromNonFriendsChange}
        />

        <PreferencesSection
          maxDistance={settingsContext.maxDistanceForVisibleGames}
          setMaxDistance={handleMaxDistanceChange}
          alertBefore={settingsContext.alertBeforeGameStarts}
          setAlertBefore={handleAlertBeforeChange}
          alertTime={settingsContext.alertTimeBeforeGame}
          setAlertTime={handleAlertTimeChange}
          alertOnStart={settingsContext.alertOnStart}
          setAlertOnStart={handleAlertOnStartChange}
        />
      </div>
    </div>
  );
};

export default SettingsPreferences;
