import { FilterOptions, SkillLevel, SportType } from '@/types/game';
import { SlidersHorizontal } from 'lucide-react';
import React from 'react';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

const SPORTS: SportType[] = ['football', 'basketball', 'tennis', 'volleyball', 'badminton'];
const SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, onReset }) => {
  const handleSportToggle = (sport: SportType) => {
    const newSports = filters.sports.includes(sport)
      ? filters.sports.filter((s) => s !== sport)
      : [...filters.sports, sport];

    onFilterChange({ ...filters, sports: newSports });
  };

  const handleSkillLevelToggle = (level: SkillLevel) => {
    const newLevels = filters.skillLevels.includes(level)
      ? filters.skillLevels.filter((l) => l !== level)
      : [...filters.skillLevels, level];

    onFilterChange({ ...filters, skillLevels: newLevels });
  };

  const handleDateChange = (value: string) => {
    onFilterChange({ ...filters, date: value || null });
  };

  const handleDistanceChange = (value: number) => {
    onFilterChange({ ...filters, maxDistance: value });
  };

  return (
    <div className='bg-white dark:bg-dark-card rounded-2xl shadow-lg p-4 mb-6'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <SlidersHorizontal className='w-5 h-5 text-light-text-primary dark:text-dark-text-primary' />
          <h2 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary'>
            Filters
          </h2>
        </div>
        <button
          onClick={onReset}
          className='text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-light-primary dark:hover:text-dark-primary'
        >
          Reset
        </button>
      </div>

      {/* Sports Filter */}
      <div className='mb-4'>
        <h3 className='text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2'>
          Sports
        </h3>
        <div className='flex flex-wrap gap-2'>
          {SPORTS.map((sport) => (
            <button
              key={sport}
              onClick={() => handleSportToggle(sport)}
              className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                filters.sports.includes(sport)
                  ? 'bg-light-primary dark:bg-dark-primary text-white'
                  : 'bg-light-hover dark:bg-dark-hover text-light-text-secondary dark:text-dark-text-secondary'
              }`}
            >
              {sport.charAt(0).toUpperCase() + sport.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Skill Levels */}
      <div className='mb-4'>
        <h3 className='text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2'>
          Skill Level
        </h3>
        <div className='flex flex-wrap gap-2'>
          {SKILL_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => handleSkillLevelToggle(level)}
              className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                filters.skillLevels.includes(level)
                  ? 'bg-light-primary dark:bg-dark-primary text-white'
                  : 'bg-light-hover dark:bg-dark-hover text-light-text-secondary dark:text-dark-text-secondary'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1'>
          Date
        </label>
        <input
          type='date'
          value={filters.date || ''}
          onChange={(e) => handleDateChange(e.target.value)}
          className='w-full px-3 py-2 rounded-lg bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary'
        />
      </div>

      {/* Distance */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2'>
          Max Distance: {filters.maxDistance}km
        </label>
        <input
          type='range'
          min='1'
          max='50'
          value={filters.maxDistance}
          onChange={(e) => handleDistanceChange(Number(e.target.value))}
          className='w-full'
        />
      </div>
    </div>
  );
};

export default FilterBar;
