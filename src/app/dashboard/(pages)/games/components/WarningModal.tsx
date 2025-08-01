import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import useTranslator from '@/hooks/useTranslator';
import React, { useState } from 'react';

interface WarningModalProps {
  isOpen: boolean;
  onConfirm: (inputValue?: string) => void;
  onCancel: () => void;
  message: string;
  warning?: string;
  showInput?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputValue?: string;
  onInputChange?: (value: string) => void;
}

const WarningModal: React.FC<WarningModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
  warning,
  showInput = false,
  inputLabel,
  inputPlaceholder,
  inputValue,
  onInputChange,
}) => {
  const text = useTranslator();
  const [isLoading, setIsLoading] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleConfirm = () => {
    setIsLoading(true);
    onConfirm(showInput ? inputValue : undefined);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
      onClick={handleBackdropClick}
    >
      <div className='bg-white dark:bg-dark-card rounded-xl shadow-xl p-8 max-w-md w-full'>
        <h2 className='text-xl font-bold mb-4 text-red-600 dark:text-red-400'>
          {warning || text.my_games.warning_title}
        </h2>
        <p className='mb-6 text-light-text-primary dark:text-dark-text-primary'>{message}</p>
        {showInput && (
          <div className='mb-6'>
            <InputField
              label={inputLabel}
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={(e) => onInputChange && onInputChange(e.target.value)}
              maxLength={100}
            />
          </div>
        )}
        <div className='flex justify-end gap-4'>
          <Button variant='ghost' onClick={onCancel}>
            {text.my_games.warning_cancel}
          </Button>
          <Button disabled={isLoading} variant='danger' onClick={handleConfirm}>
            {text.my_games.warning_confirm}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
