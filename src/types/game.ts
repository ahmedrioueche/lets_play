import { User } from './user';

export type SportType =
  | 'football'
  | 'american-football'
  | 'basketball'
  | 'tennis'
  | 'volleyball'
  | 'beach-volleyball'
  | 'baseball'
  | 'cricket'
  | 'rugby'
  | 'handball'
  | 'field-hockey'
  | 'lacrosse'
  | 'kickball'
  | 'ultimate-frisbee'
  | 'golf'
  | 'frisbee-golf'
  | 'capture-the-flag'
  | 'paintball'
  | 'airsoft'
  | 'dodgeball'
  | 'relay-race'
  | 'tug-of-war'
  | 'sack-race'
  | 'egg-and-spoon-race'
  | 'petanque'
  | 'bocce'
  | 'rounders'
  | 'cornhole'
  | 'horseshoes'
  | 'chess'
  | 'checkers'
  | 'dominoes'
  | 'cards';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type ViewMode = 'map' | 'grid' | 'calendar';
export type GameStatus = 'open' | 'full' | 'cancelled' | 'completed';

export interface Game {
  _id: string;
  id?: string;
  title: string;
  location: string;
  date: string;
  time: string;
  sport: string;
  skillLevel: string;
  ageMin?: number;
  ageMax?: number;
  description?: string;
  organizer: string | User;
  participants: (string | User)[];
  maxParticipants: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: GameStatus;
  price: number;
  image?: string;
  blockedUsers?: (string | User)[];
  presentUsers?: (string | User)[];
  joinPermission: boolean;
  joinRequests?: string[];
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

export interface IAvailableGame {
  name: string;
  groupSize: number;
  type: string;
  image: string;
}
