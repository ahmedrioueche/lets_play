import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useState } from 'react';

interface AgeStepProps {
  value: string;
  onChange: (age: string) => void;
  onNext: () => void;
}

const AgeStep: React.FC<AgeStepProps> = ({ value, onChange, onNext }) => {
  const [error, setError] = useState('');

  const ageNum = Number(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (error) setError(''); // Clear error on change
  };

  const handleNext = () => {
    let newError = '';
    if (!value || isNaN(ageNum)) {
      newError = 'Please enter your age.';
    } else if (ageNum < 10 || ageNum > 90) {
      newError = 'Age must be between 10 and 90.';
    }
    if (newError) {
      setError(newError);
      return;
    }
    setError('');
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className='p-8 flex flex-col items-center'
    >
      <h2 className='text-2xl font-bold text-light-text-primary dark:text-dark-text-primary'>
        How old are you?
      </h2>
      <Image
        src='/images/birthday.svg'
        alt='Birthday'
        width={250}
        height={400}
        className='drop-shadow-lg'
      />
      <div className='w-full flex items-center mb-2'>
        <InputField
          name='age'
          type='number'
          min={10}
          max={90}
          value={value}
          onChange={handleInputChange}
          placeholder='Your age'
          className='w-full text-lg'
          error={error || undefined}
        />
      </div>
      <Button
        variant='primary'
        className='w-full mt-2'
        onClick={handleNext}
        // Only disable if empty, not on validation
        disabled={!value}
      >
        Next
      </Button>
    </motion.div>
  );
};

export default AgeStep;
