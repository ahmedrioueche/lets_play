import Checkbox from '@/components/ui/Checkbox';
import InputField from '@/components/ui/InputField';
import useTranslator from '@/hooks/useTranslator';
import React, { useEffect, useState } from 'react';

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

interface PreferencesSectionProps {
  maxDistance: number;
  setMaxDistance: (value: number) => void;
  alertBefore: boolean;
  setAlertBefore: (value: boolean) => void;
  alertTime: number;
  setAlertTime: (value: number) => void;
  alertOnStart: boolean;
  setAlertOnStart: (value: boolean) => void;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({
  maxDistance,
  setMaxDistance,
  alertBefore,
  setAlertBefore,
  alertTime,
  setAlertTime,
  alertOnStart,
  setAlertOnStart,
}) => {
  const [maxDistanceInput, setMaxDistanceInput] = useState(maxDistance);
  const [alertTimeInput, setAlertTimeInput] = useState(alertTime);
  const t = useTranslator();

  const debouncedMaxDistance = useDebouncedValue(maxDistanceInput, 500);
  const debouncedAlertTime = useDebouncedValue(alertTimeInput, 500);

  useEffect(() => {
    setMaxDistanceInput(maxDistance);
  }, [maxDistance]);

  useEffect(() => {
    setAlertTimeInput(alertTime);
  }, [alertTime]);

  useEffect(() => {
    if (debouncedMaxDistance !== maxDistance) setMaxDistance(debouncedMaxDistance);
  }, [debouncedMaxDistance]);

  useEffect(() => {
    if (debouncedAlertTime !== alertTime) setAlertTime(debouncedAlertTime);
  }, [debouncedAlertTime]);

  return (
    <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden'>
      <div className='px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-blue-200/50 dark:border-blue-700/50'>
        <h3 className='font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2'>
          <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
          {t.preferencesTitle}
        </h3>
      </div>
      <div className='p-4 sm:p-6 space-y-3 sm:space-y-4'>
        <InputField
          label={t.maxDistanceLabel}
          type='number'
          min={1}
          max={100}
          value={maxDistanceInput}
          onChange={(e) => setMaxDistanceInput(Number(e.target.value))}
        />
        <Checkbox
          id='alertBefore'
          checked={alertBefore}
          onChange={setAlertBefore}
          label={t.alertBeforeLabel}
          description={t.alertBeforeDescription}
          accentColor='blue'
        />
        <InputField
          label={t.alertTimeLabel}
          type='number'
          min={1}
          max={180}
          value={alertTimeInput}
          onChange={(e) => setAlertTimeInput(Number(e.target.value))}
          disabled={!alertBefore}
        />
        <Checkbox
          id='alertOnStart'
          checked={alertOnStart}
          onChange={setAlertOnStart}
          label={t.alertOnStartLabel}
          description={t.alertOnStartDescription}
          accentColor='blue'
        />
      </div>
    </div>
  );
};

export default PreferencesSection;
