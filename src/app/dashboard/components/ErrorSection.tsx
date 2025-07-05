import Button from '@/components/ui/Button';
import useTranslator from '@/hooks/useTranslator';
import { AlertCircle, RefreshCw } from 'lucide-react';
import React from 'react';

interface ErrorSectionProps {
  error: string;
  onRetry: () => void;
}

const ErrorSection: React.FC<ErrorSectionProps> = ({ error, onRetry }) => {
  const text = useTranslator();

  return (
    <div className='space-y-6'>
      <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6'>
        <div className='flex items-center gap-3'>
          <AlertCircle className='w-6 h-6 text-red-500' />
          <div>
            <h3 className='text-lg font-semibold text-red-800 dark:text-red-200'>
              {text.home.error_loading_data}
            </h3>
            <p className='text-red-600 dark:text-red-300'>{error}</p>
          </div>
        </div>
        <Button variant='default' onClick={onRetry} className='mt-4 flex items-center gap-2'>
          <RefreshCw className='w-4 h-4' />
          {text.home.try_again}
        </Button>
      </div>
    </div>
  );
};

export default ErrorSection;
