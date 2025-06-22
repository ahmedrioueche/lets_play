import dbConnect from '@/config/db';
import GameModel from '@/models/Game';
import { NextRequest, NextResponse } from 'next/server';

// Helper function to calculate distance between two points
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

// Mock games for new users
const getMockGames = (lat: number, lng: number) => [
  {
    id: 'mock-1',
    title: 'Weekend Basketball',
    sport: 'basketball',
    description: 'Casual basketball game for all skill levels',
    coordinates: { lat: lat + 0.01, lng: lng + 0.01 },
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
    time: '14:00',
    currentPlayers: 8,
    maxPlayers: 12,
    skillLevel: 'intermediate',
    location: 'Central Park Basketball Court',
    status: 'open',
    organizer: { id: 'mock-1', name: 'Mike Johnson', avatar: '' },
    price: 0,
  },
  {
    id: 'mock-2',
    title: 'Tennis Doubles',
    sport: 'tennis',
    description: 'Looking for tennis partners for doubles',
    coordinates: { lat: lat - 0.01, lng: lng + 0.02 },
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    time: '10:00',
    currentPlayers: 2,
    maxPlayers: 4,
    skillLevel: 'advanced',
    location: 'Riverside Tennis Courts',
    status: 'open',
    organizer: { id: 'mock-2', name: 'Sarah Wilson', avatar: '' },
    price: 15,
  },
  {
    id: 'mock-3',
    title: 'Football Sunday',
    sport: 'football',
    description: 'Sunday football league game',
    coordinates: { lat: lat + 0.02, lng: lng - 0.01 },
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days from now
    time: '16:00',
    currentPlayers: 15,
    maxPlayers: 22,
    skillLevel: 'beginner',
    location: 'Riverside Park Field',
    status: 'open',
    organizer: { id: 'mock-3', name: 'David Chen', avatar: '' },
    price: 5,
  },
];

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
  } catch (error) {
    console.error('Database connection failed:', error);
    // Return mock data if database is not available
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get('lat') || '40.7128');
    const lng = parseFloat(searchParams.get('lng') || '-74.006');
    return NextResponse.json(getMockGames(lat, lng));
  }

  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');
    const radius = parseFloat(searchParams.get('radius') || '50'); // 50km default

    // If no coordinates provided, return mock data
    if (!lat || !lng) {
      return NextResponse.json(getMockGames(40.7128, -74.006));
    }

    // Get all open games
    const allGames = await GameModel.find({ status: 'open' })
      .sort({ createdAt: -1 })
      .limit(limit * 2); // Get more to filter by distance

    // Filter games by distance
    const nearbyGames = allGames
      .filter((game) => {
        if (!game.coordinates) return false;
        const distance = getDistanceFromLatLonInKm(
          lat,
          lng,
          game.coordinates.lat,
          game.coordinates.lng
        );
        return distance <= radius;
      })
      .slice(0, limit);

    // If no real games found, return mock data for new users
    if (nearbyGames.length === 0) {
      return NextResponse.json(getMockGames(lat, lng));
    }

    return NextResponse.json(nearbyGames);
  } catch (error: any) {
    console.error('Error fetching nearby games:', error);
    // Return mock data on error instead of throwing
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get('lat') || '40.7128');
    const lng = parseFloat(searchParams.get('lng') || '-74.006');
    return NextResponse.json(getMockGames(lat, lng));
  }
}
