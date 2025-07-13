'use client';
import ErrorSection from '@/components/ui/ErrorSection';
import Loading from '@/components/ui/Loading';
import SearchBar from '@/components/ui/SearchBar';
import { useAuth } from '@/context/AuthContext';
import useTranslator from '@/hooks/useTranslator';
import { friendInvitationsApi } from '@/lib/api/friendInvitationsApi';
import { friendsApi } from '@/lib/api/friendsApi';
import { User } from '@/types/user';
import { Sparkles, UserPlus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import WarningModal from '../games/components/WarningModal';
import FriendsSection from './components/FriendsSection';

// Empty state components
const EmptyFriends: FC = () => {
  const text = useTranslator();
  return (
    <div className='text-center py-16'>
      <div className='w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center'>
        <UserPlus className='w-16 h-16 text-blue-500 dark:text-blue-400' />
      </div>
      <h3 className='text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-3'>
        {text.friends.no_friends}
      </h3>
    </div>
  );
};

const EmptyPlayedWith: FC = () => {
  const text = useTranslator();
  return (
    <div className='text-center py-16'>
      <div className='w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 rounded-full flex items-center justify-center'>
        <Sparkles className='w-16 h-16 text-purple-500 dark:text-purple-400' />
      </div>
      <h3 className='text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-3'>
        {text.friends.no_played_with}
      </h3>
      <p className='text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-md mx-auto leading-relaxed'>
        No players found that you've played with yet.
      </p>
    </div>
  );
};

const EmptySuggestions: FC = () => {
  const text = useTranslator();
  return (
    <div className='text-center py-16'>
      <div className='w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-full flex items-center justify-center'>
        <UserPlus className='w-16 h-16 text-green-500 dark:text-green-400' />
      </div>
      <h3 className='text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-3'>
        {text.friends.no_suggestions}
      </h3>
      <p className='text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-md mx-auto leading-relaxed'>
        No friend suggestions available at the moment.
      </p>
    </div>
  );
};

// Stats overview (like games page)
const FriendsStatsOverview: FC<{ friends: User[]; playedWith: User[]; suggestions: User[] }> = ({
  friends,
  playedWith,
  suggestions,
}) => {
  const text = useTranslator();
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
      <div className='bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm opacity-90 mb-1'>{text.friends.your_friends}</p>
            <p className='text-3xl font-bold'>{friends.length}</p>
          </div>
          <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center'>
            <Users className='w-6 h-6' />
          </div>
        </div>
      </div>
      <div className='bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm opacity-90 mb-1'>{text.friends.played_with}</p>
            <p className='text-3xl font-bold'>{playedWith.length}</p>
          </div>
          <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center'>
            <Sparkles className='w-6 h-6' />
          </div>
        </div>
      </div>
      <div className='bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm opacity-90 mb-1'>{text.friends.suggestions_title}</p>
            <p className='text-3xl font-bold'>{suggestions.length}</p>
          </div>
          <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center'>
            <UserPlus className='w-6 h-6' />
          </div>
        </div>
      </div>
    </div>
  );
};

const FriendsPageHeader: FC = () => {
  const text = useTranslator();
  return (
    <div className='md:mb-8 mb-4'>
      <h1 className='text-3xl font-dancing font-bold text-light-text-primary dark:text-dark-text-primary mb-2'>
        {text.friends.page_title}
      </h1>
      <p className='hidden md:flex text-light-text-secondary dark:text-dark-text-secondary'>
        {text.friends.page_subtitle}
      </p>
    </div>
  );
};

const TABS = [
  { key: 'friends', label: 'Friends' },
  { key: 'suggestions', label: 'Suggestions' },
  { key: 'playedWith', label: 'Played With' },
];

// Add a function to determine relationship
function getRelationship(
  user: User,
  currentUser: User,
  friends: User[],
  pendingIds: string[]
): 'friend' | 'pending' | 'not_friend' | 'self' {
  if (user._id === currentUser._id) return 'self';
  if (friends.some((f) => f._id === user._id)) return 'friend';
  if (pendingIds.includes(user._id)) return 'pending';
  return 'not_friend';
}

export default function FriendsPage() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'suggestions' | 'playedWith'>('friends');
  const [friends, setFriends] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [playedWith, setPlayedWith] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Add state for search
  const [searchActive, setSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchHasMore, setSearchHasMore] = useState(true);
  const [pendingIds, setPendingIds] = useState<string[]>([]); // For pending invitations

  // Add modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<User | null>(null);

  // Load friends data
  const loadFriends = useCallback(async () => {
    if (!currentUser?._id) return;

    setLoading(true);
    setError(null);

    try {
      const friendsData = await friendsApi.getFriends(currentUser._id);
      setFriends(friendsData || []);

      // For now, we'll use empty arrays for suggestions and played with
      // These would be populated by separate API calls in a real implementation
      setSuggestions([]);
      setPlayedWith([]);
    } catch (error) {
      console.error('Error loading friends:', error);
      setError('Failed to load friends');
      toast.error('Failed to load friends');
    } finally {
      setLoading(false);
    }
  }, [currentUser?._id]);

  useEffect(() => {
    if (currentUser?._id) {
      loadFriends();
    }
  }, [currentUser?._id, loadFriends]);

  const handleAddFriend = async (id: string) => {
    if (!currentUser?._id) return;

    try {
      await friendInvitationsApi.sendInvitation(currentUser._id, id);
      // Refresh the friends list to show updated status
      await loadFriends();
    } catch (error) {
      console.error('Error sending friend invitation:', error);
    }
  };

  const handleRemoveFriend = async (id: string) => {
    if (!currentUser?._id) return;
    try {
      await friendsApi.removeFriend(currentUser._id, id);
      await loadFriends();
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error('Failed to remove friend');
    }
  };

  const handleMessage = useCallback(
    (id: string) => {
      router.push(`/dashboard/chat?friend=${id}`);
    },
    [router]
  );

  const handleCardClick = useCallback(
    (id: string) => {
      router.push(`/dashboard/profile/${id}`);
    },
    [router]
  );

  // Filter data by search
  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredSuggestions = suggestions.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPlayedWith = playedWith.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  // Fetch pending invitations (for pending status)
  useEffect(() => {
    async function fetchPending() {
      if (!currentUser?._id) return;
      try {
        const res = await friendInvitationsApi.getInvitations(currentUser._id, 'sent');
        setPendingIds(res?.map((inv: any) => inv.toUserId) || []);
      } catch {}
    }
    fetchPending();
  }, [currentUser?._id]);

  // Search users API
  const searchUsers = async (query: string, page = 1) => {
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}&page=${page}`);
      const data = await res.json();
      if (page === 1) {
        setSearchResults(data.users || []);
      } else {
        setSearchResults((prev) => [...prev, ...(data.users || [])]);
      }
      setSearchHasMore(data.hasMore);
    } catch {
      setSearchResults([]);
      setSearchHasMore(false);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    if (search.trim()) {
      setSearchActive(true);
      setSearchPage(1);
      searchUsers(search, 1);
    }
  };

  // Handle search pagination
  const handleLoadMoreSearch = () => {
    if (searchHasMore && !searchLoading) {
      const nextPage = searchPage + 1;
      setSearchPage(nextPage);
      searchUsers(search, nextPage);
    }
  };

  // Handle search bar change
  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (!val) {
      setSearchActive(false);
      setSearchResults([]);
    }
  };

  // Handle request to remove a friend
  const handleRequestRemove = (user: User) => {
    setPendingRemove(user);
    setModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (pendingRemove) {
      handleRemoveFriend(pendingRemove._id);
      setModalOpen(false);
      setPendingRemove(null);
    }
  };

  const handleCancelRemove = () => {
    setModalOpen(false);
    setPendingRemove(null);
  };

  // Loading state
  if (loading) {
    return <Loading />;
  }

  // Error state
  if (error) {
    return (
      <div className='container mx-auto'>
        <FriendsPageHeader />
        <div className='flex items-center justify-center py-20'>
          <div className='min-h-[40vh] flex flex-col items-center justify-center w-full'>
            <ErrorSection text={error} />
            <button
              onClick={loadFriends}
              className='mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto'>
      <FriendsPageHeader />

      {/* Search Bar and Tabs */}
      <div className='flex flex-col sm:flex-row items-center gap-4 mb-8 w-full'>
        <div className='flex-grow min-w-0 w-full'>
          <SearchBar value={search} onChange={handleSearchChange} onActionClick={handleSearch} />
        </div>
        {!searchActive && (
          <div className='flex-shrink-0 w-full flex justify-end'>
            <div className='inline-flex rounded-xl bg-light-card dark:bg-dark-card p-1 sm:p-2 shadow border border-light-border dark:border-dark-border w-full sm:w-auto overflow-x-auto flex-nowrap'>
              {TABS.map((tab) => (
                <button
                  name={tab.label}
                  key={tab.key}
                  aria-label={tab.label}
                  title={tab.label}
                  className={`px-3 sm:px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-shrink-0 whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'bg-light-primary dark:bg-dark-primary text-white shadow'
                      : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-background dark:hover:bg-dark-accent'
                  }`}
                  onClick={() => setActiveTab(tab.key as any)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      {!searchActive && (
        <FriendsStatsOverview friends={friends} playedWith={playedWith} suggestions={suggestions} />
      )}

      {/* Search Results */}
      {searchActive && (
        <>
          {searchLoading && searchPage === 1 ? (
            <Loading />
          ) : searchResults.length === 0 ? (
            <div className='text-center py-16 text-gray-400'>No users found.</div>
          ) : (
            <>
              <FriendsSection
                friends={searchResults}
                onAddFriend={handleAddFriend}
                onMessage={handleMessage}
                getRelationship={(user) => getRelationship(user, currentUser!, friends, pendingIds)}
                relationship='not_friend'
                onCardClick={handleCardClick}
                onRequestRemove={handleRequestRemove}
              />
              {searchHasMore && (
                <div className='flex justify-center mt-6'>
                  <button
                    className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
                    onClick={handleLoadMoreSearch}
                    disabled={searchLoading}
                  >
                    {searchLoading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Tab Content */}
      {!searchActive &&
        activeTab === 'friends' &&
        (filteredFriends.length === 0 ? (
          <EmptyFriends />
        ) : (
          <FriendsSection
            friends={filteredFriends}
            onAddFriend={handleAddFriend}
            onMessage={handleMessage}
            getRelationship={(user) => getRelationship(user, currentUser!, friends, pendingIds)}
            relationship='friend'
            onCardClick={handleCardClick}
            onRequestRemove={handleRequestRemove}
          />
        ))}

      {!searchActive &&
        activeTab === 'suggestions' &&
        (filteredSuggestions.length === 0 ? (
          <EmptySuggestions />
        ) : (
          <FriendsSection
            friends={filteredSuggestions}
            onAddFriend={handleAddFriend}
            onMessage={handleMessage}
            getRelationship={(user) => getRelationship(user, currentUser!, friends, pendingIds)}
            relationship='not_friend'
            onCardClick={handleCardClick}
            onRequestRemove={handleRequestRemove}
          />
        ))}

      {!searchActive &&
        activeTab === 'playedWith' &&
        (filteredPlayedWith.length === 0 ? (
          <EmptyPlayedWith />
        ) : (
          <FriendsSection
            friends={filteredPlayedWith}
            onAddFriend={handleAddFriend}
            onMessage={handleMessage}
            getRelationship={(user) => getRelationship(user, currentUser!, friends, pendingIds)}
            relationship='not_friend'
            onCardClick={handleCardClick}
            onRequestRemove={handleRequestRemove}
          />
        ))}

      {pendingRemove && (
        <WarningModal
          isOpen={modalOpen}
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
          message={`Are you sure you want to remove ${pendingRemove.name} from your friends?`}
          warning={'Remove Friend'}
        />
      )}
    </div>
  );
}
