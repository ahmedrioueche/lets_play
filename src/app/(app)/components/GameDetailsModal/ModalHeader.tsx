import { Game } from '@/types/game';
import { ChevronRight, X } from 'lucide-react';

interface ModalHeaderProps {
  game: Game;
  onClose: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  game,
  onClose,
  showBackButton = false,
  onBack,
  title,
}) => (
  <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-3'>
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className='p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors'
          >
            <ChevronRight className='w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary rotate-180' />
          </button>
        )}
        <div>
          <h2 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary'>
            {title || game.title}
          </h2>
          {!title && (
            <p className='text-sm mt-1 text-light-text-secondary dark:text-dark-text-secondary'>
              {game.location}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={onClose}
        className='p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors'
      >
        <X className='w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary' />
      </button>
    </div>
  </div>
);

export default ModalHeader;
