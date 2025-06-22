'use client';
import GameCard from '@/components/games/GameCard';
import { useAuth } from '@/context/AuthContext';
import useTranslator from '@/hooks/useTranslator';
import { gamesApi } from '@/lib/api/client';
import { Game } from '@/types/game';
import { useEffect, useState } from 'react';
import GameDetailsModal from './components/GameDetailsModal';

function WarningModal({
  isOpen,
  onConfirm,
  onCancel,
  message,
  warning,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  warning?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='bg-white dark:bg-dark-card rounded-xl shadow-xl p-8 max-w-md w-full'>
        <h2 className='text-xl font-bold mb-4 text-red-600 dark:text-red-400'>
          {warning || 'Warning'}
        </h2>
        <p className='mb-6 text-light-text-primary dark:text-dark-text-primary'>{message}</p>
        <div className='flex justify-end gap-4'>
          <button
            className='px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            onClick={onCancel}
          >
            {'Cancel'}
          </button>
          <button
            className='px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700'
            onClick={onConfirm}
          >
            {'Yes, Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    0.5 -
    Math.cos(((lat2 - lat1) * Math.PI) / 180) / 2 +
    (Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      (1 - Math.cos(((lon2 - lon1) * Math.PI) / 180))) /
      2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

export default function MyGamesPage() {
  const t = useTranslator();
  const [createdGames, setCreatedGames] = useState<Game[]>([]);
  const [signedUpGames, setSignedUpGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [cancelType, setCancelType] = useState<'signup' | 'game' | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => {
          setUserLocation(null);
        }
      );
    }
  }, []);

  useEffect(() => {
    async function fetchGames() {
      const allGames = await gamesApi.getGames();
      // Only games created by the current user
      let userGames = allGames.filter((g: Game) => g.organizer?.id === user?.id);
      // If user location is available, filter by proximity (e.g., within 50km)
      if (userLocation) {
        userGames = userGames.filter((g: Game) => {
          if (!g.coordinates) return false;
          const dist = getDistanceFromLatLonInKm(
            userLocation.lat,
            userLocation.lng,
            g.coordinates.lat,
            g.coordinates.lng
          );
          return dist <= 50; // 50km radius
        });
      }
      setCreatedGames(userGames);
    }
    fetchGames();
  }, [userLocation]);

  // Placeholder handlers
  const handleRegister = async () => Promise.resolve();

  const handleCancelRegistration = async () => {
    setWarningMessage(
      t.messages.warning.cancel_signup ||
        'Are you sure you want to cancel your signup for this game? Canceling may affect your credibility.'
    );
    setCancelType('signup');
    setWarningOpen(true);
  };

  const handleCancelGame = async () => {
    setWarningMessage(
      t.messages.warning.cancel_game ||
        'Are you sure you want to cancel this game? This action cannot be undone. Canceling may affect your credibility.'
    );
    setCancelType('game');
    setWarningOpen(true);
  };

  const confirmCancel = () => {
    if (!selectedGame) return;
    if (cancelType === 'signup') {
      setSignedUpGames((games) => games.filter((g) => g.id !== selectedGame.id));
    } else if (cancelType === 'game') {
      setCreatedGames((games) => games.filter((g) => g.id !== selectedGame.id));
    }
    setWarningOpen(false);
    setModalOpen(false);
    setCancelType(null);
  };

  return (
    <div className='container mx-auto p-2'>
      <div className='px-2'>
        <div className='mb-12'>
          <h2 className='text-2xl font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary'>
            {t.menu.sidebar.my_games_created || 'Games I Created'}
          </h2>
          {createdGames.length === 0 ? (
            <div className='text-light-text-secondary dark:text-dark-text-secondary'>
              {t.messages.empty.created_games || "You haven't created any games yet."}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {createdGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onClick={() => {
                    setSelectedGame(game);
                    setModalOpen(true);
                  }}
                  userLocation={null}
                />
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className='text-2xl font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary'>
            {t.menu.sidebar.my_games_signed_up || 'Games I Signed Up For'}
          </h2>
          {signedUpGames.length === 0 ? (
            <div className='text-light-text-secondary dark:text-dark-text-secondary'>
              {t.messages.empty.signedup_games || "You haven't signed up for any games yet."}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {signedUpGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onClick={() => {
                    setSelectedGame(game);
                    setModalOpen(true);
                  }}
                  userLocation={null}
                />
              ))}
            </div>
          )}
        </div>
        {selectedGame && (
          <GameDetailsModal
            game={selectedGame}
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            userLocation={null}
            onRegister={handleRegister}
            onCancelRegistration={handleCancelRegistration}
            isRegistered={signedUpGames.some((g) => g.id === selectedGame.id)}
            cancelGame={
              createdGames.some((g) => g.id === selectedGame.id) ? handleCancelGame : undefined
            }
          />
        )}
        <WarningModal
          isOpen={warningOpen}
          onConfirm={confirmCancel}
          onCancel={() => setWarningOpen(false)}
          message={warningMessage}
          warning={t.messages.warning.credibility || 'Warning: Canceling affects your credibility!'}
        />
      </div>
    </div>
  );
}
