import UserAvatar from '@/components/ui/UserAvatar';
import { useAuth } from '@/context/AuthContext';
import useTranslator from '@/hooks/useTranslator';
import { Game } from '@/types/game';
import { User as UserType } from '@/types/user';
import { AlertTriangle, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ModalHeader from './ModalHeader';

interface RegisterViewProps {
  game: Game;
  onBack: () => void;
  onClose: () => void;
  onRegister?: (gameId: string, user: UserType) => Promise<void>;
}

const RegisterView: React.FC<RegisterViewProps> = ({ game, onBack, onClose, onRegister }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const { user } = useAuth();
  const text = useTranslator();

  useEffect(() => {
    if (user && game.participants && Array.isArray(game.participants)) {
      setAlreadyRegistered(
        game.participants.some((p: any) => (typeof p === 'object' ? p._id : p) === user._id)
      );
    }
  }, [user, game.participants]);

  const handleRegister = async () => {
    if (!onRegister) return;
    if (alreadyRegistered) {
      toast.error('You are already registered for this game.');
      return;
    }

    try {
      setIsLoading(true);
      // Use _id as fallback if id is not available
      const gameId = game.id || (game as any)._id;
      if (!gameId) {
        throw new Error('Game ID not found');
      }
      await onRegister(gameId, user as UserType);
      toast.success(text.messages.success.game_registration);
      onClose();
    } catch (error) {
      console.error('Failed to register:', error);
      toast.error(text.messages.error.game_registration);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ModalHeader
        game={game}
        onClose={onClose}
        showBackButton
        onBack={onBack}
        title='Register for Game'
      />

      <div className='p-6 space-y-6'>
        {/* Game Summary */}
        <div className='p-4 bg-light-hover/50 dark:bg-dark-hover/50 rounded-xl'>
          <h3 className='font-medium text-light-text-primary dark:text-dark-text-primary mb-2'>
            {game.title}
          </h3>
          <div className='flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary'>
            <MapPin className='w-4 h-4' />
            <span>{game.location}</span>
          </div>
        </div>

        {/* User Info Summary */}
        <div className='p-4 bg-light-hover/50 dark:bg-dark-hover/50 rounded-xl'>
          <h3 className='font-medium text-light-text-primary dark:text-dark-text-primary mb-3'>
            Your Information
          </h3>
          <div className='space-y-3'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full overflow-hidden bg-light-hover dark:bg-dark-hover'>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className='w-full h-full object-cover' />
                ) : (
                  <UserAvatar />
                )}
              </div>
              <div>
                <p className='font-medium text-light-text-primary dark:text-dark-text-primary'>
                  {user?.name}
                </p>
                <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                  {user?.email}
                </p>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-3 text-sm'>
              <div>
                <p className='text-light-text-secondary dark:text-dark-text-secondary'>Phone</p>
                <p className='text-light-text-primary dark:text-dark-text-primary'>{user?.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className='mb-4'>
          <div className='flex items-start gap-3 p-4 bg-light-danger/10 dark:bg-dark-danger/10 border border-light-danger/30 dark:border-dark-danger/30 rounded-lg'>
            <AlertTriangle className='w-5 h-5 mt-0.5 flex-shrink-0 text-light-danger dark:text-dark-danger' />
            <div>
              <h4 className='font-medium text-light-danger dark:text-dark-danger mb-1'>
                Registration Commitment
              </h4>
              <p className='text-sm text-light-danger dark:text-dark-danger/90'>
                {text.messages.warning.game_registration}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className='pt-4'>
          <button
            onClick={handleRegister}
            disabled={isLoading || alreadyRegistered}
            className='w-full bg-light-primary dark:bg-dark-primary hover:opacity-90 text-white rounded-xl py-3 font-medium transition-opacity disabled:opacity-50'
          >
            {alreadyRegistered
              ? 'Already Registered'
              : isLoading
                ? 'Registering...'
                : 'Confirm Registration'}
          </button>
          {alreadyRegistered && (
            <div className='text-center text-green-600 dark:text-green-400 mt-2'>
              You are already registered for this game.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RegisterView;
