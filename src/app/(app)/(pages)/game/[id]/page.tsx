'use client';

import ActionButtons from '@/app/(app)/components/GameDetailsModal/ActionButtons';
import GameInfoSection from '@/app/(app)/components/GameDetailsModal/GameInfoSection';
import MapSection from '@/app/(app)/components/GameDetailsModal/MapSection';
import OrganizerSection from '@/app/(app)/components/GameDetailsModal/OrganizerSection';
import Loading from '@/components/ui/Loading';
import { Game } from '@/types/game';
import { Calendar, Users } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const GameDetailsPage = () => {
  const { id } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
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
    if (id) fetchGame();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <div className='p-8 text-center text-red-500'>{error}</div>;
  if (!game) return <div className='p-8 text-center'>Game not found.</div>;

  return (
    <div className='container mx-auto p-2'>
      {/* Page Header */}
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

      {/* Info Grid */}
      <div className='bg-light-card dark:bg-dark-card rounded-2xl p-6 mb-6 border border-light-border dark:border-dark-border'>
        <GameInfoSection game={game} />
      </div>

      {/* Description */}
      <div className='bg-light-card dark:bg-dark-card rounded-2xl p-6 mb-6 border border-light-border dark:border-dark-border'>
        <h2 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2'>
          About
        </h2>
        <p className='text-light-text-secondary dark:text-dark-text-secondary leading-relaxed'>
          {game.description || 'No description provided.'}
        </p>
      </div>

      {/* Map Section */}
      <div className='bg-light-card dark:bg-dark-card rounded-2xl p-6 mb-6 border border-light-border dark:border-dark-border'>
        <MapSection game={game} userLocation={null} />
      </div>

      {/* Organizer Section */}
      <div className='bg-light-card dark:bg-dark-card rounded-2xl p-6 mb-6 border border-light-border dark:border-dark-border'>
        <OrganizerSection
          game={game}
          organizer={typeof game.organizer === 'object' ? game.organizer : null}
        />
      </div>

      {/* Action Buttons */}
      <div className='bg-light-card dark:bg-dark-card rounded-2xl p-6 border border-light-border dark:border-dark-border mb-4'>
        <ActionButtons
          game={game}
          mode='explore'
          isRegistered={false}
          onRegister={() => {
            router.push(`/game/${id}/register`);
          }}
        />
      </div>
    </div>
  );
};

export default GameDetailsPage;
