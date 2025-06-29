import GamesMap from '@/components/games/GamesMap';
import { Game } from '@/types/game';

interface MapSectionProps {
  game: Game;
  userLocation: { lat: number; lng: number } | null;
}

const MapSection: React.FC<MapSectionProps> = ({ game, userLocation }) => (
  <div>
    <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2'>
      Location
    </h3>
    <div className='h-[200px] rounded-xl overflow-hidden'>
      <GamesMap
        games={[game]}
        selectedGame={game}
        onGameSelect={() => {}}
        userLocation={userLocation}
      />
    </div>
  </div>
);

export default MapSection;
