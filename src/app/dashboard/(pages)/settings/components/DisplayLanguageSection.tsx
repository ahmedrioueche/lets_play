import CustomSelect from '@/components/ui/CustomSelect';
import useTranslator from '@/hooks/useTranslator';
import { Language } from '@/types/general';
import React from 'react';

interface DisplayLanguageSectionProps {
  language: string;
  theme: string;
  onLanguageChange: (value: Language) => void;
  onThemeChange: (value: string) => void;
}

const DisplayLanguageSection: React.FC<DisplayLanguageSectionProps> = ({
  language,
  theme,
  onLanguageChange,
  onThemeChange,
}) => {
  const text = useTranslator();

  return (
    <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden'>
      <div className='px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-b border-cyan-200/50 dark:border-cyan-700/50'>
        <h3 className='font-semibold text-cyan-900 dark:text-cyan-100 flex items-center gap-2'>
          <span className='w-2 h-2 bg-cyan-500 rounded-full'></span>
          {text.settings.display_language || 'Display & Language'}
        </h3>
      </div>
      <div className='p-4 sm:p-6 space-y-3 sm:space-y-4'>
        <CustomSelect
          title={text.settings.language}
          selectedOption={language as Language}
          onChange={onLanguageChange}
          options={[
            { value: 'en', label: 'English' },
            { value: 'ar', label: 'العربية' },
            { value: 'fr', label: 'Français' },
          ]}
          className='w-full'
        />
        <CustomSelect
          title={text.settings.theme}
          selectedOption={theme}
          onChange={onThemeChange}
          options={[
            { value: 'system', label: text.settings.system || 'System' },
            { value: 'light', label: text.settings.light || 'Light' },
            { value: 'dark', label: text.settings.dark || 'Dark' },
          ]}
          className='w-full'
        />
      </div>
    </div>
  );
};

export default DisplayLanguageSection;
