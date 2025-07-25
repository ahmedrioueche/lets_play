'use client';

import ActionButtons from '@/app/dashboard/components/GameDetailsModal/ActionButtons';
import GameInfoSection from '@/app/dashboard/components/GameDetailsModal/GameInfoSection';
import MapSection from '@/app/dashboard/components/GameDetailsModal/MapSection';
import OrganizerSection from '@/app/dashboard/components/GameDetailsModal/OrganizerSection';
import ParticipantsList from '@/app/dashboard/components/GameDetailsModal/ParticipantsList';
import ErrorSection from '@/components/ui/ErrorSection';
import Loading from '@/components/ui/Loading';
import NotFound from '@/components/ui/NotFound';
import { useAuth } from '@/context/AuthContext';
import { Game } from '@/types/game';
import { User } from '@/types/user';
import { Calendar, Settings, Users } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const GameDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchGame = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/games/${id}`);
      if (!res.ok) throw new Error('Game not found');
      const data = await res.json();
      setGame(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load game');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchGame();
  }, [id]);

  if (loading) return <Loading />;
  if (error)
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <ErrorSection text={error} />
      </div>
    );
  if (!game)
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <NotFound
          text='Game not found'
          subtext='The game you are looking for does not exist or may have been removed.'
        />
      </div>
    );

  return (
    <div className='container mx-auto p-2'>
      {/* Page Header */}
      <div className='mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-dancing font-bold text-light-text-primary dark:text-dark-text-primary mb-2 flex items-center gap-2'>
            <Calendar className='w-7 h-7 text-light-primary dark:text-dark-primary' />
            {game.title}
          </h1>
          <p className='text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-2'>
            <Users className='w-5 h-5' />
            {game.participants.length}/{game.maxParticipants} Participants &bull; {game.date}{' '}
            {game.time}
          </p>
        </div>
        {/* Manage Game button for organizer */}
        {user &&
          (typeof game.organizer === 'object' ? game.organizer._id : game.organizer) ===
            user._id && (
            <button
              onClick={() => router.push(`/dashboard/games/${game.id || game._id}/audit`)}
              className='flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 font-medium transition-colors w-full sm:w-auto justify-center'
              title='Manage Game'
            >
              <Settings className='w-5 h-5' />
              Manage Game
            </button>
          )}
      </div>

      {/* Info Grid */}
      <div className='bg-light-card dark:bg-dark-card rounded-2xl p-3 sm:p-6 mb-6 border border-light-border dark:border-dark-border'>
        <GameInfoSection game={game} />
      </div>

      {/* Organizer Section */}
      <div className='bg-light-card dark:bg-dark-card rounded-2xl p-3 sm:p-6 mb-6 border border-light-border dark:border-dark-border'>
        <OrganizerSection
          game={game}
          organizer={typeof game.organizer === 'object' ? game.organizer : null}
        />
      </div>

      {/* Description */}
      <div className='bg-light-card dark:bg-dark-card rounded-2xl p-3 sm:p-6 mb-6 border border-light-border dark:border-dark-border'>
        <h2 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2'>
          About
        </h2>
        <p className='text-light-text-secondary dark:text-dark-text-secondary leading-relaxed'>
          {game.description || 'No description provided.'}
        </p>
      </div>

      {/* Map Section */}
      <div className='bg-light-card dark:bg-dark-card rounded-2xl p-3 sm:p-6 mb-6 border border-light-border dark:border-dark-border'>
        <MapSection game={game} userLocation={null} />
      </div>

      <div className='bg-light-card dark:bg-dark-card rounded-2xl p-3 sm:p-6 mb-6 border border-light-border dark:border-dark-border'>
        <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4'>
          Participants
        </h3>
        {game.organizer && (
          <ParticipantsList
            participants={game.participants.filter(
              (p): p is User => typeof p === 'object' && '_id' in p
            )}
            organizer={game.organizer as User}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className='bg-light-card dark:bg-dark-card rounded-2xl p-3 sm:p-6 border border-light-border dark:border-dark-border mb-4'>
        <ActionButtons
          game={game}
          mode='explore'
          isRegistered={
            !!user &&
            game.participants.some((p: any) => (typeof p === 'object' ? p._id : p) === user._id)
          }
          hasJoinRequest={
            !!(user && Array.isArray(game.joinRequests) && game.joinRequests.includes(user._id))
          }
          onRegister={() => router.push(`/dashboard/games/${game._id}/register`)}
          onCancelRegistration={() => {}}
        />
      </div>
    </div>
  );
};

export default GameDetailsPage;
