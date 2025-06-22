import { User } from './user';

export type SportType = 'football' | 'basketball' | 'tennis' | 'volleyball' | 'badminton';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type ViewMode = 'map' | 'grid' | 'calendar';
export type GameStatus = 'open' | 'full' | 'cancelled' | 'completed';

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
  sport: SportType;
  skillLevel: SkillLevel;
  organizer: Partial<User>;
  price: number;
  image?: string;
}

export interface FilterOptions {
  sports: SportType[];
  skillLevels: SkillLevel[];
  date: string | null;
  maxDistance: number;
}

export interface GameWithDistance extends Game {
  distance?: number;
}

export interface GameCluster {
  position: {
    lat: number;
    lng: number;
  };
  games: Game[];
}

export interface GameRecommendation {
  game: Game;
  score: number;
  reason: string;
}

export interface ExploreState {
  viewMode: ViewMode;
  filters: FilterOptions;
  searchQuery: string;
  userLocation: { lat: number; lng: number } | null;
  selectedGame: Game | null;
  filteredGames: Game[];
  games: Game[];
}
