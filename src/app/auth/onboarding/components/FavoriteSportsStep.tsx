import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import React from 'react';

const SPORTS = ['football', 'basketball', 'tennis', 'volleyball', 'badminton'];

interface FavoriteSportsStepProps {
  value: string[];
  onChange: (sports: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const FavoriteSportsStep: React.FC<FavoriteSportsStepProps> = ({
  value,
  onChange,
  onNext,
  onBack,
}) => {
  const toggleSport = (sport: string) => {
    if (value.includes(sport)) {
      onChange(value.filter((s) => s !== sport));
    } else {
      onChange([...value, sport]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className='p-8 flex flex-col items-center'
    >
      <h2 className='text-2xl font-bold mb-4 text-light-text-primary dark:text-dark-text-primary'>
        What sports do you like?
      </h2>
      <div className='flex flex-wrap gap-3 mb-6 justify-center'>
        {SPORTS.map((sport) => (
          <button
            key={sport}
            type='button'
            onClick={() => toggleSport(sport)}
            className={`px-4 py-2 rounded-full border transition-all text-sm font-semibold shadow-sm
              ${
                value.includes(sport)
                  ? 'bg-light-primary dark:bg-dark-primary text-white border-light-primary dark:border-dark-primary scale-105'
                  : 'bg-light-hover dark:bg-dark-hover text-light-text-primary dark:text-dark-text-primary border-light-border dark:border-dark-border hover:scale-105'
              }
            `}
          >
            {sport.charAt(0).toUpperCase() + sport.slice(1)}
          </button>
        ))}
      </div>
      <div className='flex w-full gap-2'>
        <Button variant='default' className='w-1/2' onClick={onBack}>
          Back
        </Button>
        <Button variant='primary' className='w-1/2' onClick={onNext} disabled={value.length === 0}>
          Next
        </Button>
      </div>
    </motion.div>
  );
};

export default FavoriteSportsStep;
