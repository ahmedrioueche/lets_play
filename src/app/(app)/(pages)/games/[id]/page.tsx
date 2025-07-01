'use client';

import GameDetailsView from '@/app/(app)/components/GameDetailsModal/GameDetailsView';
import Loading from '@/components/ui/Loading';
import { useAuth } from '@/context/AuthContext';
import { Game } from '@/types/game';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const GameDetailsPage = () => {
  const { id } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

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

  // For now, userLocation is not used, but could be passed from context or geolocation
  return (
    <div className='min-h-screen bg-light-background dark:bg-dark-background flex flex-col items-center py-8'>
      <div className='w-full max-w-2xl bg-white dark:bg-dark-card rounded-2xl shadow-xl overflow-hidden'>
        <GameDetailsView
          game={game}
          userLocation={null}
          mode='explore'
          isRegistered={false}
          onClose={() => {}}
          onRegister={() => {}}
        />
      </div>
    </div>
  );
};

export default GameDetailsPage;
