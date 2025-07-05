import { IAvailableGame } from '@/types/game';

export const availableGames: IAvailableGame[] = [
  // Team & Ball Sports
  {
    name: 'football',
    groupSize: 10,
    type: 'team-sport',
    image: '/images/sports/football.svg',
  },
  {
    name: 'american-football',
    groupSize: 10,
    type: 'team-sport',
    image: '/images/sports/american-football.svg',
  },
  {
    name: 'basketball',
    groupSize: 10,
    type: 'team-sport',
    image: '/images/sports/basketball.svg',
  },
  { name: 'tennis', groupSize: 2, type: 'racket-sport', image: '/images/sports/tennis.svg' },
  {
    name: 'volleyball',
    groupSize: 6,
    type: 'team-sport',
    image: '/images/sports/volleyball.svg',
  },
  {
    name: 'beach-volleyball',
    groupSize: 4,
    type: 'team-sport',
    image: '/images/sports/beach-volleyball.svg',
  },
  {
    name: 'baseball',
    groupSize: 18,
    type: 'team-sport',
    image: '/images/sports/baseball.svg',
  },
  { name: 'cricket', groupSize: 22, type: 'team-sport', image: '/images/sports/cricket.svg' },
  { name: 'rugby', groupSize: 15, type: 'team-sport', image: '/images/sports/rugby.svg' },
  {
    name: 'handball',
    groupSize: 14,
    type: 'team-sport',
    image: '/images/sports/handball.svg',
  },
  {
    name: 'field-hockey',
    groupSize: 22,
    type: 'team-sport',
    image: '/images/sports/field-hockey.svg',
  },
  {
    name: 'lacrosse',
    groupSize: 12,
    type: 'team-sport',
    image: '/images/sports/lacrosse.svg',
  },
  {
    name: 'kickball',
    groupSize: 14,
    type: 'team-sport',
    image: '/images/sports/kickball.svg',
  },

  // Group & Fun Games
  {
    name: 'ultimate-frisbee',
    groupSize: 14,
    type: 'fun-game',
    image: '/images/sports/ultimate-frisbee.svg',
  },
  {
    name: 'golf',
    groupSize: 4,
    type: 'fun-game',
    image: '/images/sports/golf.svg',
  },
  {
    name: 'frisbee-golf',
    groupSize: 4,
    type: 'fun-game',
    image: '/images/sports/frisbee-golf.svg',
  },
  {
    name: 'capture-the-flag',
    groupSize: 10,
    type: 'fun-game',
    image: '/images/sports/capture-the-flag.svg',
  },
  {
    name: 'paintball',
    groupSize: 12,
    type: 'fun-game',
    image: '/images/sports/paintball.svg',
  },
  { name: 'airsoft', groupSize: 12, type: 'fun-game', image: '/images/sports/airsoft.svg' },
  {
    name: 'dodgeball',
    groupSize: 10,
    type: 'fun-game',
    image: 'images/sports/dodgeball.svg',
  },
  {
    name: 'relay-race',
    groupSize: 4,
    type: 'fun-game',
    image: '/images/sports/relay-race.svg',
  },
  {
    name: 'tug-of-war',
    groupSize: 10,
    type: 'fun-game',
    image: '/images/sports/tug-of-war.svg',
  },
  { name: 'sack-race', groupSize: 4, type: 'fun-game', image: 'images/sports/sack-race.svg' },
  {
    name: 'egg-and-spoon-race',
    groupSize: 4,
    type: 'fun-game',
    image: '/images/sports/egg-and-spoon-race.svg',
  },

  // Social Outdoor Games
  {
    name: 'petanque',
    groupSize: 4,
    type: 'outdoor-game',
    image: '/images/sports/petanque.svg',
  },
  { name: 'bocce', groupSize: 4, type: 'outdoor-game', image: '/images/sports/bocce.svg' },
  {
    name: 'rounders',
    groupSize: 12,
    type: 'outdoor-game',
    image: '/images/sports/rounders.svg',
  },
  {
    name: 'cornhole',
    groupSize: 4,
    type: 'outdoor-game',
    image: '/images/sports/cornhole.svg',
  },
  {
    name: 'horseshoes',
    groupSize: 4,
    type: 'outdoor-game',
    image: '/images/sports/horseshoes.svg',
  },

  // Tabletop or Park Games
  { name: 'chess', groupSize: 2, type: 'tabletop', image: '/images/sports/chess.svg' },
  { name: 'checkers', groupSize: 2, type: 'tabletop', image: '/images/sports/checkers.svg' },
  { name: 'dominoes', groupSize: 4, type: 'tabletop', image: '/images/sports/dominoes.svg' },
  { name: 'cards', groupSize: 4, type: 'tabletop', image: '/images/sports/cards.svg' },
];
