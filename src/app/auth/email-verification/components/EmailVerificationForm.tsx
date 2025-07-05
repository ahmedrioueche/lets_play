import Button from '@/components/ui/Button';
import useTranslator from '@/hooks/useTranslator';
import React, { useRef } from 'react';

interface EmailVerificationFormProps {
  email: string;
  onSubmit: (otp: string) => void;
  isLoading: boolean;
  error: string | null;
  onResend: () => void;
  resendLoading: boolean;
}

const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({
  email,
  onSubmit,
  isLoading,
  error,
  onResend,
  resendLoading,
}) => {
  const t = useTranslator();
  const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[i] = value;
    setOtp(newOtp);
    if (value && i < 5) {
      inputs.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      setOtp((prev) => {
        const copy = [...prev];
        copy[i - 1] = '';
        return copy;
      });
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('Text').replace(/\D/g, '').slice(0, 6).split('');
    if (pasted.length === 6) {
      setOtp(pasted);
      inputs.current[5]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(otp.join(''));
  };

  return (
    <form onSubmit={handleSubmit} className='p-8 flex flex-col items-center'>
      <h2 className='text-2xl font-bold mb-2 text-light-text-primary dark:text-dark-text-primary'>
        {t.auth.email_verification_title}
      </h2>
      <p className='mb-6 text-light-text-secondary dark:text-dark-text-secondary text-center'>
        {t.auth.email_verification_description} <span className='font-semibold'>{email}</span>.
        <br />
        {t.auth.email_verification_instruction}
      </p>
      <div className='flex flex-wrap justify-center gap-1 md:gap-2 mb-4 w-full'>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            type='text'
            inputMode='numeric'
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            className='w-10 md:w-12 h-12 text-center text-2xl rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition'
            autoFocus={i === 0}
            disabled={isLoading}
          />
        ))}
      </div>
      {error && (
        <div className='mt-2 mb-4 text-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
          <p className='text-red-600 dark:text-red-400 text-sm'>{error}</p>
        </div>
      )}

      <Button
        type='submit'
        variant='primary'
        className='w-full mb-2'
        disabled={isLoading || otp.some((d) => d === '')}
      >
        {isLoading ? t.auth.email_verification_verifying : t.auth.email_verification_verify}
      </Button>
      <Button
        type='button'
        variant='default'
        className='w-full'
        onClick={onResend}
        disabled={resendLoading || isLoading}
      >
        {resendLoading
          ? t.auth.email_verification_resending
          : t.auth.email_verification_resend_code}
      </Button>
    </form>
  );
};

export default EmailVerificationForm;
