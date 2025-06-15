import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { FilterOptions, SportType, SkillLevel } from '@/types/explore';

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
      ? filters.sports.filter(s => s !== sport)
      : [...filters.sports, sport];
    
    onFilterChange({ ...filters, sports: newSports });
  };

  const handleSkillLevelToggle = (level: SkillLevel) => {
    const newLevels = filters.skillLevels.includes(level)
      ? filters.skillLevels.filter(l => l !== level)
      : [...filters.skillLevels, level];
    
    onFilterChange({ ...filters, skillLevels: newLevels });
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    onFilterChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [type]: value ? new Date(value) : null,
      },
    });
  };

  const handleDistanceChange = (value: number) => {
    onFilterChange({ ...filters, maxDistance: value });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    onFilterChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: value ? Number(value) : null,
      },
    });
  };

  const handleAvailableSpotsToggle = () => {
    onFilterChange({ ...filters, availableSpots: !filters.availableSpots });
  };

  const handleFriendsToggle = () => {
    onFilterChange({ ...filters, onlyFriends: !filters.onlyFriends });
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-light-text-primary dark:text-dark-text-primary" />
          <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
            Filters
          </h2>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-light-primary dark:hover:text-dark-primary"
        >
          Reset
        </button>
      </div>

      {/* Sports Filter */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
          Sports
        </h3>
        <div className="flex flex-wrap gap-2">
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
      <div className="mb-4">
        <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
          Skill Level
        </h3>
        <div className="flex flex-wrap gap-2">
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

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
            onChange={(e) => handleDateChange('start', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
            End Date
          </label>
          <input
            type="date"
            value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
            onChange={(e) => handleDateChange('end', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary"
          />
        </div>
      </div>

      {/* Distance */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
          Max Distance: {filters.maxDistance}km
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={filters.maxDistance}
          onChange={(e) => handleDistanceChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
            Min Price
          </label>
          <input
            type="number"
            value={filters.priceRange.min || ''}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            placeholder="Min"
            className="w-full px-3 py-2 rounded-lg bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
            Max Price
          </label>
          <input
            type="number"
            value={filters.priceRange.max || ''}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            placeholder="Max"
            className="w-full px-3 py-2 rounded-lg bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.availableSpots}
            onChange={handleAvailableSpotsToggle}
            className="w-4 h-4 rounded border-light-border dark:border-dark-border"
          />
          <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Only show games with available spots
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onlyFriends}
            onChange={handleFriendsToggle}
            className="w-4 h-4 rounded border-light-border dark:border-dark-border"
          />
          <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Only show games with friends
          </span>
        </label>
      </div>
    </div>
  );
};

export default FilterBar; 