export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
  location?: {
    lat: number;
    lng: number;
  };
  registeredGames: string[];
  createdAt: string;
  updatedAt: string;
}

// Example current user for development
export const currentUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  avatar: '/images/avatars/default.jpg',
  bio: 'Love playing sports and meeting new people!',
  location: {
    lat: 40.7128,
    lng: -74.006,
  },
  registeredGames: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
