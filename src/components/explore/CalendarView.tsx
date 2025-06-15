import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Game } from '@/types/explore';

interface CalendarViewProps {
  games: Game[];
  onGameSelect: (game: Game) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ games, onGameSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

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
    return games.filter(game => {
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

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-full hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
        </button>
        <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-full hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Week Days */}
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const gamesForDay = getGamesForDay(day);
          const isToday = new Date().getDate() === day &&
            new Date().getMonth() === currentDate.getMonth() &&
            new Date().getFullYear() === currentDate.getFullYear();

          return (
            <div
              key={day}
              className={`aspect-square p-2 rounded-lg border ${
                isToday
                  ? 'border-light-primary dark:border-dark-primary bg-light-primary/5 dark:bg-dark-primary/5'
                  : 'border-light-border dark:border-dark-border'
              }`}
            >
              <div className="flex flex-col h-full">
                <span className={`text-sm font-medium ${
                  isToday
                    ? 'text-light-primary dark:text-dark-primary'
                    : 'text-light-text-primary dark:text-dark-text-primary'
                }`}>
                  {day}
                </span>
                {gamesForDay.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {gamesForDay.map(game => (
                      <button
                        key={game.id}
                        onClick={() => onGameSelect(game)}
                        className="w-full text-left text-xs p-1 rounded bg-light-hover dark:bg-dark-hover text-light-text-primary dark:text-dark-text-primary truncate hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 transition-colors"
                      >
                        {game.time} - {game.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView; 