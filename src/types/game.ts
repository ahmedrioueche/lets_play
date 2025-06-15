export type GameStatus = 'open' | 'full' | 'starting_soon';

export interface Game {
  id: string;
  title: string;
  description: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  date: string;
  time: string;
  currentPlayers: number;
  maxPlayers: number;
  status: GameStatus;
  image?: string;
  sport: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  price?: number;
  organizer: {
    id: string;
    name: string;
    avatar?: string;
  };
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
} 