import GamesMap from '@/components/games/GamesMap';
import { useAuth } from '@/context/AuthContext';
import { Game } from '@/types/game';
import { User } from '@/types/user';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronRight, Clock, MapPin, User as UserIcon, Users, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

// Default user icon SVG
const DefaultUserIcon = () => (
  <svg
    className='w-full h-full text-light-text-secondary dark:text-dark-text-secondary'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
    <circle cx='12' cy='7' r='4' />
  </svg>
);

interface GameDetailsModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
  userLocation: { lat: number; lng: number } | null;
  onRegister: (gameId: string, user: User) => Promise<void>;
  onCancelRegistration: (gameId: string, userId: string) => Promise<void>;
  isRegistered: boolean;
  cancelGame?: () => void;
}

type ModalView = 'details' | 'register';

const GameDetailsModal: React.FC<GameDetailsModalProps> = ({
  game,
  isOpen,
  onClose,
  userLocation,
  onRegister,
  onCancelRegistration,
  isRegistered,
  cancelGame,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ModalView>('details');
  const [notes, setNotes] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      await onRegister(game.id, {
        ...user,
        notes,
      } as User);
      setCurrentView('details');
    } catch (error) {
      console.error('Failed to register:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    try {
      setIsLoading(true);
      await onCancelRegistration(game.id, user?.id || '');
    } catch (error) {
      console.error('Failed to cancel registration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDetailsView = () => (
    <>
      {/* Header */}
      <div className='p-6 border-b border-gray-200 dark:border-gray-700 scrollbar-hide'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary'>
              {game.title}
            </h2>
            <p className='mt-1 text-light-text-secondary dark:text-dark-text-secondary'>
              {game.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors'
          >
            <X className='w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary' />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className='p-6 space-y-6'>
        {/* Game Info */}
        <div className='grid grid-cols-2 gap-4 p-4 bg-light-hover/50 dark:bg-dark-hover/50 rounded-xl'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-white dark:bg-dark-card rounded-lg'>
              <Users className='w-5 h-5 text-light-primary dark:text-dark-primary' />
            </div>
            <div>
              <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                Players
              </p>
              <p className='font-medium text-light-text-primary dark:text-dark-text-primary'>
                {game.currentPlayers}/{game.maxPlayers}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-white dark:bg-dark-card rounded-lg'>
              <Calendar className='w-5 h-5 text-light-primary dark:text-dark-primary' />
            </div>
            <div>
              <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                Date
              </p>
              <p className='font-medium text-light-text-primary dark:text-dark-text-primary'>
                {game.date}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-white dark:bg-dark-card rounded-lg'>
              <Clock className='w-5 h-5 text-light-primary dark:text-dark-primary' />
            </div>
            <div>
              <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                Time
              </p>
              <p className='font-medium text-light-text-primary dark:text-dark-text-primary'>
                {game.time}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-white dark:bg-dark-card rounded-lg'>
              <UserIcon className='w-5 h-5 text-light-primary dark:text-dark-primary' />
            </div>
            <div>
              <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                Skill Level
              </p>
              <p className='font-medium text-light-text-primary dark:text-dark-text-primary'>
                {game.skillLevel.charAt(0).toUpperCase() + game.skillLevel.slice(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2'>
            About
          </h3>
          <p className='text-light-text-secondary dark:text-dark-text-secondary leading-relaxed'>
            {game.description}
          </p>
        </div>

        {/* Map */}
        <div>
          <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2'>
            Location
          </h3>
          <div className='h-[200px] rounded-xl overflow-hidden border border-light-border dark:border-dark-border'>
            <GamesMap
              games={[game]}
              selectedGame={game}
              onGameSelect={() => {}} // No game selection in create mode
              userLocation={userLocation}
            />
          </div>
        </div>

        {/* Organizer */}
        <div>
          <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2'>
            Organizer
          </h3>
          <div className='flex items-center gap-3 p-4 bg-light-hover/50 dark:bg-dark-hover/50 rounded-xl'>
            <div className='w-12 h-12 rounded-full overflow-hidden bg-light-hover dark:bg-dark-hover'>
              {game.organizer.avatar ? (
                <img
                  src={game.organizer.avatar}
                  alt={game.organizer.name}
                  className='w-full h-full object-cover'
                />
              ) : (
                <DefaultUserIcon />
              )}
            </div>
            <div>
              <p className='font-medium text-light-text-primary dark:text-dark-text-primary'>
                {game.organizer.name}
              </p>
              <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                Organizer
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className='pt-4 space-y-3'>
          {isRegistered && (
            <button
              onClick={handleCancelRegistration}
              disabled={isLoading}
              className='w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 font-medium transition-colors disabled:opacity-50'
            >
              {isLoading ? 'Canceling...' : 'Cancel Registration'}
            </button>
          )}
          {cancelGame && (
            <button
              onClick={cancelGame}
              className='w-full bg-red-700 hover:bg-red-800 text-white rounded-xl py-3 font-medium transition-colors border-2 border-red-800 mt-2'
            >
              Cancel Entire Game
            </button>
          )}
        </div>
      </div>
    </>
  );

  const renderRegisterView = () => (
    <>
      {/* Header */}
      <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setCurrentView('details')}
              className='p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors'
            >
              <ChevronRight className='w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary rotate-180' />
            </button>
            <h2 className='text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary'>
              Register for Game
            </h2>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors'
          >
            <X className='w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary' />
          </button>
        </div>
      </div>

      {/* Content */}
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
                  <DefaultUserIcon />
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

        {/* Additional Notes */}
        <div>
          <label className='block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1'>
            Additional Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className='w-full px-4 py-2 rounded-lg bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary'
            rows={3}
            placeholder="Any additional information you'd like to share with the organizer"
          />
        </div>

        {/* Action Button */}
        <div className='pt-4'>
          <button
            onClick={handleRegister}
            disabled={isLoading}
            className='w-full bg-light-primary dark:bg-dark-primary hover:opacity-90 text-white rounded-xl py-3 font-medium transition-opacity disabled:opacity-50'
          >
            {isLoading ? 'Registering...' : 'Confirm Registration'}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 z-50'
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
          >
            <div
              ref={modalRef}
              className='scrollbar-hide bg-white dark:bg-dark-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'
            >
              <AnimatePresence mode='wait'>
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, x: currentView === 'register' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: currentView === 'register' ? -20 : 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentView === 'details' ? renderDetailsView() : renderRegisterView()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GameDetailsModal;
