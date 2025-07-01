'use client';

import WarningModal from '@/app/(app)/(pages)/games/components/WarningModal';
import MapSection from '@/app/(app)/components/GameDetailsModal/MapSection';
import ParticipantsList from '@/app/(app)/components/GameDetailsModal/ParticipantsList';
import Loading from '@/components/ui/Loading';
import UserAvatar from '@/components/ui/UserAvatar';
import { useAuth } from '@/context/AuthContext';
import { Game } from '@/types/game';
import { AlertTriangle, Calendar, MapPin, Users } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const RegisterGamePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/games/${id}`);
        if (!res.ok) throw new Error('Game not found');
        const data = await res.json();
        setGame(data);
        if (user && data.participants && Array.isArray(data.participants)) {
          setAlreadyRegistered(
            data.participants.some((p: any) => (typeof p === 'object' ? p._id : p) === user._id)
          );
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load game');
      } finally {
        setLoading(false);
      }
    };
    if (id && user) fetchGame();
  }, [id, user]);

  const handleRegister = async () => {
    if (!user || !game) return;
    if (alreadyRegistered) {
      toast.error('You are already registered for this game.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/games/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      toast.success('Registered successfully!');
      router.push(`/games`);
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!user || !game) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/games/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Cancellation failed');
      toast.success('Registration cancelled!');
      setGame(data.game);
      setAlreadyRegistered(false);
    } catch (err: any) {
      toast.error(err.message || 'Cancellation failed');
    } finally {
      setIsLoading(false);
      setShowWarning(false);
    }
  };

  if (loading) return <Loading />;
  if (error || !game)
    return <div className='p-8 text-center text-red-500'>{error || 'Game not found.'}</div>;

  return (
    <div className='container mx-auto  p-2'>
      {/* Page Header (match game details page) */}
      <div className='mb-8'>
        <h1 className='text-3xl font-dancing font-bold text-light-text-primary dark:text-dark-text-primary mb-2 flex items-center gap-2'>
          <Calendar className='w-7 h-7 text-light-primary dark:text-dark-primary' />
          {game.title}
        </h1>
        <p className='text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-2'>
          <Users className='w-5 h-5' />
          {game.currentPlayers}/{game.maxPlayers} players &bull; {game.date} {game.time}
        </p>
      </div>
      {/* Game Summary */}
      <div className='p-4 bg-light-card dark:bg-dark-card rounded-xl mb-4'>
        <h3 className='font-medium text-light-text-primary dark:text-dark-text-primary mb-2'>
          {game.title}
        </h3>
        <div className='flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary'>
          <MapPin className='w-4 h-4' />
          <span>{game.location}</span>
        </div>
      </div>
      {/* User Info Summary */}
      <div className='p-4 bg-light-card dark:bg-dark-card rounded-xl mb-4'>
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
        </div>
      </div>
      {/* Map Section (match game details page) */}
      <div className='bg-light-card dark:bg-dark-card rounded-2xl p-6 mb-4 border border-light-border dark:border-dark-border'>
        <MapSection game={game} userLocation={null} />
      </div>
      {/* Participants List */}
      <div className='bg-light-card dark:bg-dark-card rounded-2xl p-6 mb-4 border border-light-border dark:border-dark-border'>
        <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2'>
          Participants
        </h3>
        <ParticipantsList participants={game.participants || []} />
      </div>
      {alreadyRegistered && !isLoading ? (
        <div className='mb-4'>
          <div className='flex items-start gap-3 p-4 bg-light-danger/10 dark:bg-dark-danger/10 border border-light-danger/30 dark:border-dark-danger/30 rounded-lg'>
            <AlertTriangle className='w-5 h-5 mt-0.5 flex-shrink-0 text-light-danger dark:text-dark-danger' />
            <div>
              <h4 className='font-medium text-light-danger dark:text-dark-danger mb-1'>Alert</h4>
              <p className='text-sm text-light-danger dark:text-dark-danger/90'>
                You are already registered for this game.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className='mb-4'>
          <div className='flex items-start gap-3 p-4 bg-light-danger/10 dark:bg-dark-danger/10 border border-light-danger/30 dark:border-dark-danger/30 rounded-lg'>
            <AlertTriangle className='w-5 h-5 mt-0.5 flex-shrink-0 text-light-danger dark:text-dark-danger' />
            <div>
              <h4 className='font-medium text-light-danger dark:text-dark-danger mb-1'>
                Registration Commitment
              </h4>
              <p className='text-sm text-light-danger dark:text-dark-danger/90'>
                Please only register if you are sure you can attend. No-shows may affect your
                credibility.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Action Button */}
      <div className='pt-4'>
        {alreadyRegistered ? (
          <>
            <button
              onClick={() => setShowWarning(true)}
              disabled={isLoading}
              className='w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 font-medium transition-opacity disabled:opacity-50'
            >
              {isLoading ? 'Cancelling...' : 'Cancel Registration'}
            </button>
            <WarningModal
              isOpen={showWarning}
              onConfirm={handleCancelRegistration}
              onCancel={() => setShowWarning(false)}
              message='Canceling your registration will impact your credibility. Are you sure you want to proceed?'
              warning='Warning: Canceling affects your credibility!'
            />
          </>
        ) : (
          <button
            onClick={handleRegister}
            disabled={isLoading || alreadyRegistered}
            className='w-full bg-light-primary dark:bg-dark-primary hover:opacity-90 text-white rounded-xl py-3 font-medium transition-opacity disabled:opacity-50'
          >
            {isLoading ? 'Registering...' : 'Confirm Registration'}
          </button>
        )}
      </div>
    </div>
  );
};

export default RegisterGamePage;
