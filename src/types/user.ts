export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
  age?: string | number;
  favoriteSports?: string[];
  isVerified?: boolean;
  hasCompletedOnboarding?: boolean;
  location?: {
    lat: number;
    lng: number;
  };
  registeredGames: string[];
  createdAt: string;
  updatedAt: string;
}
