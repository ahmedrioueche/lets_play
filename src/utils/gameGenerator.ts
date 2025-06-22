import { Game, SportType, SkillLevel } from '@/types/explore';

const SPORTS: SportType[] = ['football', 'basketball', 'tennis', 'volleyball', 'badminton'];
const SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];
const LOCATIONS = [
  'Central Park',
  'Riverside Park',
  'Bryant Park',
  'Madison Square Park',
  'Union Square',
  'Prospect Park',
  'Riverside Courts',
  'Downtown Sports Center',
  'Community Center',
  'High School Field',
];

// Function to generate a random number between min and max
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Function to generate a random date within the next 7 days
const generateRandomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(random(0, 7)));
  return date.toISOString().split('T')[0];
};

// Function to generate a random time between 8 AM and 8 PM
const generateRandomTime = () => {
  const hour = Math.floor(random(8, 20));
  const minute = Math.floor(random(0, 4)) * 15;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

// Function to generate a random location offset from a center point
const generateRandomLocation = (centerLat: number, centerLng: number, maxDistance: number) => {
  // Convert maxDistance from kilometers to degrees (approximate)
  const maxDegrees = maxDistance / 111.32;

  // Generate random offset
  const latOffset = random(-maxDegrees, maxDegrees);
  const lngOffset = random(-maxDegrees, maxDegrees);

  return {
    lat: centerLat + latOffset,
    lng: centerLng + lngOffset,
  };
};

// Function to generate a random game
const generateRandomGame = (id: number, centerLat: number, centerLng: number): Game => {
  const location = generateRandomLocation(centerLat, centerLng, 5); // 5km radius
  const maxPlayers = Math.floor(random(4, 12)) * 2; // Even number between 4 and 12
  const currentPlayers = Math.floor(random(1, maxPlayers));
  const sport = SPORTS[Math.floor(random(0, SPORTS.length))];

  return {
    id: id.toString(),
    title: `${sport.charAt(0).toUpperCase() + sport.slice(1)} Game`,
    description: `Join us for a fun game of ${sport}! All skill levels welcome.`,
    location: LOCATIONS[Math.floor(random(0, LOCATIONS.length))],
    coordinates: location,
    date: generateRandomDate(),
    time: generateRandomTime(),
    currentPlayers,
    maxPlayers,
    status: currentPlayers >= maxPlayers ? 'full' : 'open',
    sport: sport,
    skillLevel: SKILL_LEVELS[Math.floor(random(0, SKILL_LEVELS.length))],
    organizer: {
      id: Math.floor(random(1, 100)).toString(),
      name: `Organizer ${Math.floor(random(1, 100))}`,
      avatar: '/images/avatars/default.jpg',
    },
    price: Math.floor(random(0, 20)),
  };
};

// Function to generate multiple games around a location
export const generateNearbyGames = (
  centerLat: number,
  centerLng: number,
  count: number = 10
): Game[] => {
  return Array.from({ length: count }, (_, index) =>
    generateRandomGame(index + 1, centerLat, centerLng)
  );
}; 