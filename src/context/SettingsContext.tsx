"use client";

import { Language } from "@/types/general";
import { createContext, useContext, useState, useEffect } from "react";

type SettingsContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en"); // Default language

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("appLanguage");
    if (savedLanguage) {
      setLanguage(savedLanguage as Language);
    }
  }, []);

  // Save to localStorage when language changes
  useEffect(() => {
    localStorage.setItem("appLanguage", language);
  }, [language]);

  return (
    <SettingsContext.Provider value={{ language, setLanguage }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
