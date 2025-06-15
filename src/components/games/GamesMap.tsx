import React, { useCallback, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Game } from '@/types/explore';

interface GamesMapProps {
  games: Game[];
  selectedGame: Game | null;
  onGameSelect: (game: Game) => void;
  userLocation: { lat: number; lng: number } | null;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

const GamesMap: React.FC<GamesMapProps> = ({
  games,
  selectedGame,
  onGameSelect,
  userLocation,
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerSize, setMarkerSize] = useState<google.maps.Size | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    setMarkerSize(new google.maps.Size(40, 40));
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const center = userLocation || defaultCenter;

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        }}
      >
        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: '/images/marker-user.svg',
              scaledSize: markerSize || undefined,
            }}
          />
        )}

        {/* Game Markers */}
        {games.map((game) => (
          <Marker
            key={game.id}
            position={game.coordinates}
            onClick={() => onGameSelect(game)}
            icon={{
              url: '/images/marker.svg',
              scaledSize: markerSize || undefined,
            }}
          />
        ))}

        {/* Info Window for Selected Game */}
        {selectedGame && (
          <InfoWindow
            position={selectedGame.coordinates}
            onCloseClick={() => onGameSelect(selectedGame)}
          >
            <div className="p-2">
              <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                {selectedGame.title}
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {selectedGame.location}
              </p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {selectedGame.date} at {selectedGame.time}
              </p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {selectedGame.currentPlayers}/{selectedGame.maxPlayers} players
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GamesMap; 