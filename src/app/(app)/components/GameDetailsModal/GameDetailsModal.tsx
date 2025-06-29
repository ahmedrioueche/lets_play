'use client';
import { Game } from '@/types/game';
import { User as UserType } from '@/types/user';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import GameDetailsView from './GameDetailsView';
import RegisterView from './RegisterView';

interface GameDetailsModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
  userLocation: { lat: number; lng: number } | null;
  onRegister?: (gameId: string, user: UserType) => Promise<void>;
  onCancelRegistration?: (gameId: string, userId: string) => Promise<void>;
  onCancelGame?: () => void;
  isRegistered?: boolean;
  mode?: 'explore' | 'games'; // 'explore' for registration, 'games' for management
}

type ModalView = 'details' | 'register';

const GameDetailsModal: React.FC<GameDetailsModalProps> = ({
  game,
  isOpen,
  onClose,
  userLocation,
  onRegister,
  onCancelRegistration,
  onCancelGame,
  isRegistered = false,
  mode = 'explore',
}) => {
  const [currentView, setCurrentView] = useState<ModalView>('details');
  const modalRef = useRef<HTMLDivElement>(null);

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

  const handleBackToDetails = () => {
    setCurrentView('details');
  };

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
              className='scrollbar-hide bg-white dark:bg-dark-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pb-4'
            >
              <AnimatePresence mode='wait'>
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, x: currentView === 'register' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: currentView === 'register' ? -20 : 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentView === 'details' ? (
                    <GameDetailsView
                      game={game}
                      userLocation={userLocation}
                      mode={mode}
                      isRegistered={isRegistered}
                      onClose={onClose}
                      onRegister={() => setCurrentView('register')}
                      onCancelRegistration={onCancelRegistration}
                      onCancelGame={onCancelGame}
                    />
                  ) : (
                    <RegisterView
                      game={game}
                      onBack={handleBackToDetails}
                      onClose={onClose}
                      onRegister={onRegister}
                    />
                  )}
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
