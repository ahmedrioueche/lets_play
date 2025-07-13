import useTranslator from '@/hooks/useTranslator';
import React from 'react';

interface NotFoundProps {
  text?: string;
  icon?: React.ReactNode;
  subtext?: string;
}

const NotFound: React.FC<NotFoundProps> = ({ text, icon, subtext }) => {
  const t = useTranslator();

  // Use provided text or fallback to translation or default
  const displayText = text || (t as any).not_found?.title || 'Page Not Found';
  const displaySubtext =
    subtext ||
    (t as any).not_found?.description ||
    "Oops! The page you're looking for seems to have gone for a game break.";

  return (
    <div className='min-h-screen bg-light-background dark:bg-dark-background flex items-center justify-center px-4 animate-fade-in'>
      <div className='max-w-md w-full text-center'>
        {/* Icon Section */}
        <div className='mb-8 animate-bounce-in'>
          {icon || (
            <div className='relative mx-auto w-32 h-32 mb-6'>
              {/* Default 404 icon with gradient */}
              <div className='absolute inset-0 bg-game-gradient rounded-full flex items-center justify-center shadow-lg'>
                <span className='text-4xl font-bold text-white font-dancing'>404</span>
              </div>
              {/* Decorative elements */}
              <div className='absolute -top-2 -right-2 w-6 h-6 bg-light-secondary dark:bg-dark-secondary rounded-full animate-pulse'></div>
              <div
                className='absolute -bottom-2 -left-2 w-4 h-4 bg-light-accent dark:bg-dark-accent rounded-full animate-pulse'
                style={{ animationDelay: '0.5s' }}
              ></div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className='space-y-4 animate-slide-up'>
          <h2 className='text-4xl md:text-5xl font-bold text-light-text-primary dark:text-dark-text-primary font-dancing'>
            {displayText}
          </h2>

          {displaySubtext && (
            <p className='text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-sm mx-auto leading-relaxed'>
              {displaySubtext}
            </p>
          )}
        </div>

        {/* Decorative Background Elements */}
        <div className='absolute inset-0 pointer-events-none overflow-hidden'>
          <div className='absolute top-20 left-10 w-2 h-2 bg-light-primary dark:bg-dark-primary rounded-full animate-pulse'></div>
          <div
            className='absolute top-40 right-20 w-3 h-3 bg-light-secondary dark:bg-dark-secondary rounded-full animate-pulse'
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className='absolute bottom-32 left-20 w-2 h-2 bg-light-accent dark:bg-dark-accent rounded-full animate-pulse'
            style={{ animationDelay: '1.5s' }}
          ></div>
          <div
            className='absolute bottom-20 right-10 w-3 h-3 bg-light-primary dark:bg-dark-primary rounded-full animate-pulse'
            style={{ animationDelay: '2s' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
