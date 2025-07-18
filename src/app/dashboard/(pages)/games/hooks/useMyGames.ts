import { useAuth } from '@/context/AuthContext';
import { gamesApi } from '@/lib/api/gamesApi';
import { Game } from '@/types/game';
import { useEffect, useState } from 'react';

interface UseMyGamesReturn {
  createdGames: Game[];
  signedUpGames: Game[];
  selectedGame: Game | null;
  modalOpen: boolean;
  warningOpen: boolean;
  warningMessage: string;
  cancelType: 'signup' | 'game' | null;
  userLocation: { lat: number; lng: number } | null;
  isLoading: boolean;
  setSelectedGame: (game: Game | null) => void;
  setModalOpen: (open: boolean) => void;
  setWarningOpen: (open: boolean) => void;
  setWarningMessage: (message: string) => void;
  setCancelType: (type: 'signup' | 'game' | null) => void;
  handleCancelRegistration: () => void;
  handleCancelGame: () => void;
  confirmCancel: () => void;
  refetchGames: () => Promise<void>;
}

export const useMyGames = (): UseMyGamesReturn => {
  const [createdGames, setCreatedGames] = useState<Game[]>([]);
  const [signedUpGames, setSignedUpGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [cancelType, setCancelType] = useState<'signup' | 'game' | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Get user's location
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

  // Fetch and filter games
  const fetchGames = async () => {
    try {
      setIsLoading(true);
      const allGames = await gamesApi.getGames();
      console.log('Fetched games:', allGames);
      console.log('Current user:', user);
      console.log('User location:', userLocation);
      // Filter games created by the current user
      let userCreatedGames = allGames.filter((g: Game) => {
        const organizerId =
          typeof g.organizer === 'object' && g.organizer !== null && '_id' in g.organizer
            ? g.organizer._id
            : g.organizer;
        return organizerId === user?._id;
      });
      // Filter games the user has signed up for (participants)
      let userSignedUpGames = allGames.filter(
        (g: Game) =>
          Array.isArray(g.participants) &&
          g.participants.some((participant: any) => {
            if (typeof participant === 'object' && participant !== null && '_id' in participant) {
              return participant._id === user?._id;
            }
            return participant === user?._id;
          }) &&
          (typeof g.organizer === 'object' && g.organizer !== null && '_id' in g.organizer
            ? g.organizer._id
            : g.organizer) !== user?._id
      );
      // TEMP: Disable location filtering for debugging
      // if (userLocation) {
      //   userCreatedGames = userCreatedGames.filter((g: Game) => {
      //     if (!g.coordinates) return false;
      //     const dist = getDistanceFromLatLonInKm(
      //       userLocation.lat,
      //       userLocation.lng,
      //       g.coordinates.lat,
      //       g.coordinates.lng
      //     );
      //     return dist <= 50;
      //   });
      //   userSignedUpGames = userSignedUpGames.filter((g: Game) => {
      //     if (!g.coordinates) return false;
      //     const dist = getDistanceFromLatLonInKm(
      //       userLocation.lat,
      //       userLocation.lng,
      //       g.coordinates.lat,
      //       g.coordinates.lng
      //     );
      //     return dist <= 50;
      //   });
      // }
      setCreatedGames(userCreatedGames);
      setSignedUpGames(userSignedUpGames);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchGames();
    }
  }, [userLocation, user?._id]);

  const handleCancelRegistration = () => {
    setWarningMessage(
      'Are you sure you want to cancel your signup for this game? Canceling may affect your credibility.'
    );
    setCancelType('signup');
    setWarningOpen(true);
  };

  const handleCancelGame = () => {
    setWarningMessage(
      'Are you sure you want to cancel this game? This action cannot be undone. Canceling may affect your credibility.'
    );
    setCancelType('game');
    setWarningOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedGame || !user?._id) return;

    try {
      if (cancelType === 'signup') {
        // Cancel registration for the game
        await gamesApi.cancelRegistration(selectedGame._id, user._id);
        setSignedUpGames((games) => games.filter((g) => g._id !== selectedGame._id));
      } else if (cancelType === 'game') {
        // Delete the entire game
        await gamesApi.deleteGame(selectedGame._id, user._id);
        setCreatedGames((games) => games.filter((g) => g._id !== selectedGame._id));
      }
    } catch (error) {
      console.error('Error canceling:', error);
      // You might want to show an error message to the user here
    } finally {
      setWarningOpen(false);
      setModalOpen(false);
      setCancelType(null);
    }
  };

  return {
    createdGames,
    signedUpGames,
    selectedGame,
    modalOpen,
    warningOpen,
    warningMessage,
    cancelType,
    userLocation,
    isLoading,
    setSelectedGame,
    setModalOpen,
    setWarningOpen,
    setWarningMessage,
    setCancelType,
    handleCancelRegistration,
    handleCancelGame,
    confirmCancel,
    refetchGames: fetchGames,
  };
};
