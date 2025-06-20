import React from 'react';
import { Search, MapPin } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onLocationClick: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onLocationClick }) => {
  return (
    <div className="flex-1 flex items-center gap-2 bg-white dark:bg-dark-card rounded-xl px-4 py-2">
      <Search className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search games..."
        className="flex-1 bg-transparent border-none outline-none text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-secondary dark:placeholder:text-dark-text-secondary"
      />
      <button
        onClick={onLocationClick}
        className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg transition-colors"
      >
        <MapPin className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
      </button>
    </div>
  );
};

export default SearchBar; 