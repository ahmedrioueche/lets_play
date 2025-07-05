'use client';
import { useAuth } from '@/context/AuthContext';
import useTranslator from '@/hooks/useTranslator';
import { Game } from '@/types/game';
import { User } from '@/types/user';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import GameDetailsView from './GameDetailsView';
import RegisterView from './RegisterView';

interface GameDetailsModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  mode: 'explore' | 'games';
  isRegistered: boolean;
  hasJoinRequest?: boolean;
  onRegister?: (gameId: string, user: User) => Promise<void>;
  onCancelRegistration?: (gameId: string) => void;
  onCancelGame?: () => void;
}

type ModalView = 'details' | 'register';

const GameDetailsModal: React.FC<GameDetailsModalProps> = ({
  game,
  isOpen,
  onClose,
  mode,
  isRegistered,
  hasJoinRequest = false,
  onRegister,
  onCancelRegistration,
  onCancelGame,
}) => {
  const [currentView, setCurrentView] = useState<ModalView>('details');
  const modalRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const text = useTranslator();

  // Determine if the user has already sent a join request
  const hasJoinRequestState = !!(
    user &&
    game &&
    Array.isArray(game.joinRequests) &&
    game.joinRequests.includes(user._id)
  );

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

  const handleJoinRequest = async (reason?: string) => {
    if (!user) {
      toast.error('You must be logged in to request to join a game');
      return;
    }

    try {
      const res = await fetch(`/api/games/${game?._id}/join-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, reason }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to send join request');
      }

      toast.success(text.game.join_request_sent);
    } catch (error: any) {
      toast.error(error.message || text.game.join_request_failed);
    }
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
                      game={game!}
                      mode={mode}
                      isRegistered={isRegistered}
                      hasJoinRequest={hasJoinRequestState}
                      onClose={onClose}
                      onRegister={() => setCurrentView('register')}
                      onCancelRegistration={onCancelRegistration}
                      onCancelGame={onCancelGame}
                    />
                  ) : (
                    <RegisterView
                      game={game!}
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
