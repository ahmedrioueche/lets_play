import useTranslator from '@/hooks/useTranslator';
import React from 'react';

interface AccessibilitySectionProps {
  accessibility: boolean;
  highContrast: boolean;
  largeText: boolean;
  onAccessibilityChange: (value: boolean) => void;
  onHighContrastChange: (value: boolean) => void;
  onLargeTextChange: (value: boolean) => void;
}

const AccessibilitySection: React.FC<AccessibilitySectionProps> = ({
  accessibility,
  highContrast,
  largeText,
  onAccessibilityChange,
  onHighContrastChange,
  onLargeTextChange,
}) => {
  const text = useTranslator();

  return (
    <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden'>
      <div className='px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-b border-orange-200/50 dark:border-orange-700/50'>
        <h3 className='font-semibold text-orange-900 dark:text-orange-100 flex items-center gap-2'>
          <span className='w-2 h-2 bg-orange-500 rounded-full'></span>
          {text.settings.accessibility || 'Accessibility'}
        </h3>
      </div>
      <div className='p-4 sm:p-6 space-y-3 sm:space-y-4'>
        <div className='flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'>
          <div>
            <label
              htmlFor='accessibility'
              className='text-gray-900 dark:text-gray-100 font-medium cursor-pointer'
            >
              {text.settings.accessibility_mode || 'Accessibility Mode'}
            </label>
            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
              Enable enhanced accessibility features
            </p>
          </div>
          <input
            id='accessibility'
            type='checkbox'
            checked={accessibility}
            onChange={(e) => onAccessibilityChange(e.target.checked)}
            className='accent-orange-500 w-5 h-5 rounded focus:ring-2 focus:ring-orange-500 transition-all'
          />
        </div>

        <div className='flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'>
          <div>
            <label
              htmlFor='highContrast'
              className='text-gray-900 dark:text-gray-100 font-medium cursor-pointer'
            >
              {text.settings.high_contrast || 'High Contrast'}
            </label>
            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
              Increase contrast for better visibility
            </p>
          </div>
          <input
            id='highContrast'
            type='checkbox'
            checked={highContrast}
            onChange={(e) => onHighContrastChange(e.target.checked)}
            className='accent-orange-500 w-5 h-5 rounded focus:ring-2 focus:ring-orange-500 transition-all'
          />
        </div>

        <div className='flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'>
          <div>
            <label
              htmlFor='largeText'
              className='text-gray-900 dark:text-gray-100 font-medium cursor-pointer'
            >
              {text.settings.large_text || 'Large Text'}
            </label>
            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
              Increase text size for better readability
            </p>
          </div>
          <input
            id='largeText'
            type='checkbox'
            checked={largeText}
            onChange={(e) => onLargeTextChange(e.target.checked)}
            className='accent-orange-500 w-5 h-5 rounded focus:ring-2 focus:ring-orange-500 transition-all'
          />
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySection;
