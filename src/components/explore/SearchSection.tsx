import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import SearchBar from './SearchBar';
import ViewToggle from '@/components/games/ViewToggle';
import { ViewMode } from '@/types/explore';

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
    <div className="w-full">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card text-light-text-primary dark:text-dark-text-primary rounded-xl hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={onFilterClick}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card text-light-text-primary dark:text-dark-text-primary rounded-xl hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Desktop and Expanded Mobile Layout */}
      <div
        className={`flex flex-col md:flex-row gap-4 ${
          isExpanded ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            onLocationClick={onLocationClick}
          />
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle currentView={currentView} onViewChange={onViewChange} />
          <button
            onClick={onFilterClick}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card text-light-text-primary dark:text-dark-text-primary rounded-xl hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSection; 