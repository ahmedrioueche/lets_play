import useTranslator from '@/hooks/useTranslator';
import { UserPlus } from 'lucide-react';
import React from 'react';

interface Suggestion {
  id: string;
  name: string;
  avatar?: string;
  mutualFriends?: number;
}

interface SuggestionsSectionProps {
  suggestions: Suggestion[];
  onAddFriend: (id: string) => void;
}

const SuggestionsSection: React.FC<SuggestionsSectionProps> = ({ suggestions, onAddFriend }) => {
  const text = useTranslator();

  return suggestions.length === 0 ? null : (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          className='flex flex-col items-center rounded-xl p-4 shadow hover:shadow-lg transition-all border border-light-border dark:border-dark-border bg-white/60 dark:bg-gray-900/60'
        >
          <img
            src={suggestion.avatar || '/images/logo.svg'}
            alt={suggestion.name}
            className='w-16 h-16 rounded-full object-cover border-2 border-green-400 shadow mb-2'
          />
          <div className='font-semibold text-light-text-primary dark:text-dark-text-primary mb-1'>
            {suggestion.name}
          </div>
          {suggestion.mutualFriends !== undefined && (
            <div className='text-xs text-gray-400 mb-2'>
              {suggestion.mutualFriends} {text.friends.mutual_friends}
            </div>
          )}
          <button
            className='px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-1 text-sm font-medium transition-colors mt-2'
            onClick={() => onAddFriend(suggestion.id)}
          >
            <UserPlus className='w-4 h-4' /> {text.friends.add_friend}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SuggestionsSection;
