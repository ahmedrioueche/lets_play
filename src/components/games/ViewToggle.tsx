import React from 'react';
import { Map, Grid, Calendar } from 'lucide-react';
import { ViewMode } from '@/types/explore';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  const views: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'map', icon: <Map className="w-5 h-5" />, label: 'Map' },
    { mode: 'grid', icon: <Grid className="w-5 h-5" />, label: 'Grid' },
    { mode: 'calendar', icon: <Calendar className="w-5 h-5" />, label: 'Calendar' },
  ];

  return (
    <div className="flex items-center gap-2 bg-light-hover dark:bg-dark-hover rounded-lg p-1">
      {views.map(({ mode, icon, label }) => (
        <button
          key={mode}
          onClick={() => onViewChange(mode)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300 ${
            currentView === mode
              ? 'bg-white dark:bg-dark-card text-light-primary dark:text-dark-primary shadow-sm'
              : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary'
          }`}
        >
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewToggle; 
