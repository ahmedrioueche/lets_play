import { useState, useEffect } from 'react';
import { gamesService } from '@/services/firebase/games';
import { Game } from '@/types/explore';

export const useGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all games
  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const gamesData = await gamesService.getAllGames();
      setGames(gamesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  // Search games
  const searchGames = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const results = await gamesService.searchGames(query);
      setGames(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search games');
    } finally {
      setLoading(false);
    }
  };

  // Get games by sport
  const getGamesBySport = async (sport: string) => {
    try {
      setLoading(true);
      setError(null);
      const results = await gamesService.getGamesBySport(sport);
      setGames(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get games by sport');
    } finally {
      setLoading(false);
    }
  };

  // Get games by location
  const getGamesByLocation = async (location: string) => {
    try {
      setLoading(true);
      setError(null);
      const results = await gamesService.getGamesByLocation(location);
      setGames(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get games by location');
    } finally {
      setLoading(false);
    }
  };

  // Create new game
  const createGame = async (gameData: Omit<Game, 'id'>) => {
    try {
      setError(null);
      const newGame = await gamesService.createGame(gameData);
      setGames(prev => [...prev, newGame]);
      return newGame;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create game');
      throw err;
    }
  };

  // Update game
  const updateGame = async (id: string, gameData: Partial<Game>) => {
    try {
      setError(null);
      await gamesService.updateGame(id, gameData);
      setGames(prev => prev.map(game => 
        game.id === id ? { ...game, ...gameData } : game
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update game');
      throw err;
    }
  };

  // Delete game
  const deleteGame = async (id: string) => {
    try {
      setError(null);
      await gamesService.deleteGame(id);
      setGames(prev => prev.filter(game => game.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete game');
      throw err;
    }
  };

  // Load games on mount
  useEffect(() => {
    loadGames();
  }, []);

  return {
    games,
    loading,
    error,
    loadGames,
    searchGames,
    getGamesBySport,
    getGamesByLocation,
    createGame,
    updateGame,
    deleteGame
  };
}; 