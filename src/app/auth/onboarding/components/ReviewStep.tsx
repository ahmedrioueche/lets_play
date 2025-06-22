import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import React from 'react';

interface ReviewStepProps {
  data: {
    age: string;
    location: { lat: number; lng: number } | null;
    favoriteSports: string[];
  };
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ data, onSubmit, onBack, isLoading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className='p-8 flex flex-col items-center'
    >
      <h2 className='text-2xl font-bold mb-4 text-light-text-primary dark:text-dark-text-primary'>
        Review your info
      </h2>
      <div className='w-full mb-6 space-y-3'>
        <div className='flex justify-between'>
          <span className='font-medium text-light-text-secondary dark:text-dark-text-secondary'>
            Age:
          </span>
          <span className='text-light-text-primary dark:text-dark-text-primary'>{data.age}</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium text-light-text-secondary dark:text-dark-text-secondary'>
            Location:
          </span>
          <span className='text-light-text-primary dark:text-dark-text-primary'>
            {data.location ? `${data.location.lat}, ${data.location.lng}` : 'Not set'}
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium text-light-text-secondary dark:text-dark-text-secondary'>
            Favorite Sports:
          </span>
          <span className='text-light-text-primary dark:text-dark-text-primary'>
            {data.favoriteSports.length > 0
              ? data.favoriteSports.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')
              : 'None'}
          </span>
        </div>
      </div>
      <div className='flex w-full gap-2'>
        <Button variant='default' className='w-1/2' onClick={onBack}>
          Back
        </Button>
        <Button variant='primary' className='w-1/2' onClick={onSubmit} disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </motion.div>
  );
};

export default ReviewStep;
