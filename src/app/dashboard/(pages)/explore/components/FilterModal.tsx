import { availableGames } from '@/constants/game';
import useTranslator from '@/hooks/useTranslator';
import { FilterOptions, SkillLevel, SportType } from '@/types/game';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import React from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, filters, onFilterChange }) => {
  const t = useTranslator();

  const handleSportChange = (sport: string) => {
    onFilterChange({
      ...filters,
      sports: filters.sports.includes(sport as SportType)
        ? filters.sports.filter((s) => s !== sport)
        : [...filters.sports, sport as SportType],
    });
  };

  const handleSkillLevelChange = (level: string) => {
    onFilterChange({
      ...filters,
      skillLevels: filters.skillLevels.includes(level as SkillLevel)
        ? filters.skillLevels.filter((l) => l !== level)
        : [...filters.skillLevels, level as SkillLevel],
    });
  };

  const handleDateChange = (date: string) => {
    onFilterChange({
      ...filters,
      date: filters.date === date ? null : date,
    });
  };

  const handleDistanceChange = (distance: number) => {
    onFilterChange({
      ...filters,
      maxDistance: distance,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50'
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className='fixed inset-x-4 top-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:max-w-lg w-full bg-white dark:bg-dark-card rounded-2xl shadow-xl z-50 overflow-hidden max-h-[95vh] overflow-y-auto'
          >
            <div className='p-6'>
              {/* Header */}
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold text-light-text-primary dark:text-dark-text-primary'>
                  Filters
                </h2>
                <button
                  onClick={onClose}
                  className='p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors'
                >
                  <X className='w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary' />
                </button>
              </div>

              {/* Content */}
              <div className='space-y-6'>
                {/* Sports */}
                <div>
                  <h3 className='text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-3'>
                    {t.games}
                  </h3>
                  <div className='flex flex-wrap gap-2 max-h-40 overflow-y-auto scrollbar-thin pr-1'>
                    {availableGames.map((sport) => (
                      <button
                        key={sport.name}
                        onClick={() => handleSportChange(sport.name as SportType)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          filters.sports.includes(sport.name as SportType)
                            ? 'bg-light-primary dark:bg-dark-primary text-white'
                            : 'bg-light-hover dark:bg-dark-hover text-light-text-primary dark:text-dark-text-primary'
                        }`}
                      >
                        {sport.name.charAt(0).toUpperCase() + sport.name.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skill Levels */}
                <div>
                  <h3 className='text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-3'>
                    {t.skillLevel}
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {[t.skill.beginner, t.skill.intermediate, t.skill.advanced].map((level) => (
                      <button
                        key={level}
                        onClick={() => handleSkillLevelChange(level as SkillLevel)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          filters.skillLevels.includes(level as SkillLevel)
                            ? 'bg-light-primary dark:bg-dark-primary text-white'
                            : 'bg-light-hover dark:bg-dark-hover text-light-text-primary dark:text-dark-text-primary'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div>
                  <h3 className='text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-3'>
                    {t.date}
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {[t.time.today, t.time.tomorrow, t.time.this_week, t.time.this_month].map(
                      (date) => (
                        <button
                          key={date}
                          onClick={() => handleDateChange(date)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            filters.date === date
                              ? 'bg-light-primary dark:bg-dark-primary text-white'
                              : 'bg-light-hover dark:bg-dark-hover text-light-text-primary dark:text-dark-text-primary'
                          }`}
                        >
                          {date
                            .split('-')
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Distance */}
                <div>
                  <h3 className='text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-3'>
                    {t.distance}
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {[5, 10, 25, 50, 100, 200, 300].map((distance) => (
                      <button
                        key={distance}
                        onClick={() => handleDistanceChange(distance)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          filters.maxDistance === distance
                            ? 'bg-light-primary dark:bg-dark-primary text-white'
                            : 'bg-light-hover dark:bg-dark-hover text-light-text-primary dark:text-dark-text-primary'
                        }`}
                      >
                        {distance} km
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterModal;
