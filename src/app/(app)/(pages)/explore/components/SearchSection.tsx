import ViewToggle from '@/components/games/ViewToggle';
import SearchBar from '@/components/ui/SearchBar';
import { ViewMode } from '@/types/game';
import { ChevronDown, ChevronUp, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import React, { useState } from 'react';

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onLocationClick: () => void;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onFilterClick: () => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  onSearchChange,
  onLocationClick,
  currentView,
  onViewChange,
  onFilterClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className='w-full'>
      {/* Mobile Header */}
      <div className='md:hidden flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card text-light-text-primary dark:text-dark-text-primary rounded-xl hover:bg-light-hover dark:hover:bg-dark-hover transition-colors'
          >
            <Search className='w-5 h-5' />
            <span>Search</span>
            {isExpanded ? <ChevronUp className='w-5 h-5' /> : <ChevronDown className='w-5 h-5' />}
          </button>
          <button
            onClick={onFilterClick}
            className='flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card text-light-text-primary dark:text-dark-text-primary rounded-xl hover:bg-light-hover dark:hover:bg-dark-hover transition-colors'
          >
            <SlidersHorizontal className='w-5 h-5' />
            <span>Filters</span>
          </button>
        </div>

        {/* Search Bar (Mobile) */}
        <div className={`${isExpanded ? 'block' : 'hidden'}`}>
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            onActionClick={onLocationClick}
            actionIcon={<MapPin />}
          />
        </div>

        {/* View Toggle (Mobile) */}
        <div>
          <ViewToggle currentView={currentView} onViewChange={onViewChange} />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className='hidden md:flex flex-row gap-4'>
        <div className='flex-1'>
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            onActionClick={onLocationClick}
            actionIcon={<MapPin />}
          />
        </div>
        <div className='flex items-center gap-4'>
          <ViewToggle currentView={currentView} onViewChange={onViewChange} />
          <button
            onClick={onFilterClick}
            className='flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card text-light-text-primary dark:text-dark-text-primary rounded-xl hover:bg-light-hover dark:hover:bg-dark-hover transition-colors'
          >
            <SlidersHorizontal className='w-5 h-5' />
            <span>Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
