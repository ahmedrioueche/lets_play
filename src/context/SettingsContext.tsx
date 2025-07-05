'use client';

import { Language } from '@/types/general';
import { Settings } from '@/types/user';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

type SettingsContextType = Settings & {
  setSettings: (settings: Partial<Settings>) => void;
  saveSettings: (settings: Partial<Settings>) => void;
};

// Function to get user's device language
const getUserDeviceLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
    const langCode = browserLang.split('-')[0].toLowerCase();

    // Check if we support this language
    if (langCode === 'fr' || langCode === 'es' || langCode === 'nl' || langCode === 'it') {
      return langCode as Language;
    }
  }
  return 'en';
};

const defaultSettings: Settings = {
  language: getUserDeviceLanguage(),
  theme: 'system',
  pushNotifications: true,
  emailNotifications: true,
  privacy: 'friends',
  profileVisibility: 'public',
  maxDistanceForVisibleGames: 100,
  alertBeforeGameStarts: true,
  alertTimeBeforeGame: 30,
  alertOnStart: true,
  alertWhenGameStarts: true,
  allowDirectGameInvites: true,
  allowMessagesFromNonFriends: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettingsState] = useState<Settings>(defaultSettings);

  // Load settings from backend or localStorage on mount
  useEffect(() => {
    async function loadSettings() {
      if (user?._id) {
        try {
          const res = await fetch(`/api/users/${user._id}/user-profile`);
          const data = await res.json();
          if (data?.userProfile?.settings) {
            setSettingsState({ ...defaultSettings, ...data.userProfile.settings });
            localStorage.setItem('appSettings', JSON.stringify(data.userProfile.settings));
            return;
          }
        } catch (e) {
          // fallback to localStorage
        }
      }
      // fallback to localStorage
      const saved = localStorage.getItem('appSettings');
      if (saved) {
        setSettingsState({ ...defaultSettings, ...JSON.parse(saved) });
      }
    }
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  // Save to backend and localStorage when settings change
  useEffect(() => {
    if (user?._id) {
      fetch(`/api/users/${user._id}/user-profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
    }
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings, user?._id]);

  const setSettings = (newSettings: Partial<Settings>) => {
    setSettingsState((prev) => ({ ...prev, ...newSettings }));
  };

  const saveSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettingsState(updated);

    if (user?._id) {
      fetch(`/api/users/${user._id}/user-profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: updated }),
      });

      localStorage.setItem('appSettings', JSON.stringify(updated));

      return updated;
    }
  };

  return (
    <SettingsContext.Provider value={{ ...settings, setSettings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
