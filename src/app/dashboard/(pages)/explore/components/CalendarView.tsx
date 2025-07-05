import GameCard from '@/components/games/GameCard';
import { Game } from '@/types/game';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

interface CalendarViewProps {
  games: Game[];
  onGameSelect: (game: Game) => void;
  userLocation: { lat: number; lng: number } | null;
}

const CalendarView: React.FC<CalendarViewProps> = ({ games, onGameSelect, userLocation }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);

  const getGamesForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return games.filter((game) => {
      const gameDate = new Date(game.date);
      return (
        gameDate.getDate() === date.getDate() &&
        gameDate.getMonth() === date.getMonth() &&
        gameDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    onGameSelect(game);
  };

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Calendar */}
        <div className='bg-white dark:bg-dark-card rounded-xl shadow-lg p-3 w-full lg:w-[60%] h-[500px]'>
          {/* Calendar Header */}
          <div className='flex items-center justify-between mb-3'>
            <button
              onClick={handlePrevMonth}
              className='p-1.5 rounded-full hover:bg-light-hover dark:hover:bg-dark-hover transition-colors'
            >
              <ChevronLeft className='w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary' />
            </button>
            <h2 className='text-base font-semibold text-light-text-primary dark:text-dark-text-primary'>
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={handleNextMonth}
              className='p-1.5 rounded-full hover:bg-light-hover dark:hover:bg-dark-hover transition-colors'
            >
              <ChevronRight className='w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary' />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className='grid grid-cols-7 gap-1'>
            {/* Week Days */}
            {weekDays.map((day) => (
              <div
                key={day}
                className='text-center text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary py-1'
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className='aspect-square' />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const gamesForDay = getGamesForDay(day);
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear();

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-[70px] p-1 rounded-lg border text-left ${
                    isToday
                      ? 'border-light-primary dark:border-dark-primary bg-light-primary/5 dark:bg-dark-primary/5'
                      : selectedDay === day
                        ? 'border-light-primary dark:border-dark-primary'
                        : 'border-light-border dark:border-dark-border'
                  }`}
                >
                  <div className='flex flex-col h-full'>
                    <span
                      className={`text-xs font-medium ${
                        isToday
                          ? 'text-light-primary dark:text-dark-primary'
                          : 'text-light-text-primary dark:text-dark-text-primary'
                      }`}
                    >
                      {day}
                    </span>
                    {gamesForDay.length > 0 && (
                      <div className='mt-0.5'>
                        <span className='text-[10px] text-light-text-secondary dark:text-dark-text-secondary'>
                          {gamesForDay.length} game{gamesForDay.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Game Details */}
        <div className='w-full lg:flex-1 h-[500px]'>
          {selectedDay ? (
            <div className='bg-white dark:bg-dark-card rounded-xl shadow-lg p-4 h-full flex flex-col'>
              <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4'>
                {months[currentDate.getMonth()]} {selectedDay}, {currentDate.getFullYear()}
              </h3>
              <div className='space-y-4 overflow-y-auto flex-1 pr-2'>
                {getGamesForDay(selectedDay).map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onClick={() => handleGameSelect(game)}
                    userLocation={userLocation}
                  />
                ))}
                {getGamesForDay(selectedDay).length === 0 && (
                  <p className='text-center text-light-text-secondary dark:text-dark-text-secondary py-4'>
                    No games scheduled for this day
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className='bg-white dark:bg-dark-card rounded-xl shadow-lg p-4 flex items-center justify-center h-full'>
              <p className='text-light-text-secondary dark:text-dark-text-secondary'>
                Select a day to view games
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
