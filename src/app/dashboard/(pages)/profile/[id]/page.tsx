'use client';

import FriendButton from '@/app/dashboard/(pages)/profile/components/FriendButton';
import Loading from '@/components/ui/Loading';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { capitalize } from '@/utils/helper';
import { motion } from 'framer-motion';
import {
  Award,
  BadgeCheck,
  Calendar,
  Camera,
  Edit3,
  Heart,
  MapPin,
  MessageCircle,
  Settings,
  Star,
  Target,
  TrendingUp,
  Trophy,
  User,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import UserCard from '../../friends/components/UserCard';
import AvatarModal from './components/AvatarModal';
import EditProfileModal from './components/EditProfileModal';

export default function ProfilePage() {
  const { user: currentUser, checkAuth } = useAuth();
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'achievements' | 'friends'>(
    'overview'
  );
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const {
    profile: profileUser,
    loading: isLoading,
    refresh: refreshProfile,
  } = useUserProfile(userId);
  const isCurrentUser = currentUser?._id === userId;
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  // Ensure client-only rendering for anything that depends on client-side data
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('CLIENT profileUser', profileUser);
      console.log('CLIENT currentUser', currentUser);
    }
  }, [profileUser, currentUser]);

  if (typeof window === 'undefined') {
    console.log('SERVER profileUser', profileUser);
    console.log('SERVER currentUser', currentUser);
  }

  if (!hasMounted) return null;

  let locationDisplay = 'Location not available';
  if (profileUser?.location) {
    if (typeof profileUser.location === 'object' && profileUser.location.address) {
      locationDisplay = profileUser.location.address;
      if (
        profileUser.location.cords &&
        profileUser.location.cords.lat !== undefined &&
        profileUser.location.cords.lng !== undefined
      ) {
        locationDisplay += ` (Lat: ${profileUser.location.cords.lat}, Lng: ${profileUser.location.cords.lng})`;
      }
    }
  }

  const handleMessage = () => {
    router.push(`/chat?user=${userId}`);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !isCurrentUser) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      setAvatarPreview(previewUrl);
    };
    reader.readAsDataURL(file);

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`/api/users/${userId}/avatar`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload avatar');
      const data = await response.json();
      toast.success('Avatar updated!');
      // Update AuthContext user state and refresh profile data
      await checkAuth();
      await refreshProfile();
      setAvatarPreview(null); // Optionally clear preview after update
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async (updatedData: any) => {
    try {
      // Update core user fields
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: updatedData.bio,
          location: updatedData.location,
          phone: updatedData.phone,
          name: updatedData.name,
        }),
      });
      if (!res.ok) throw new Error('Failed to update profile');

      // Update UserProfile fields (especially name)
      const resProfile = await fetch(`/api/users/${userId}/user-profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updatedData.name,
        }),
      });
      if (!resProfile.ok) throw new Error('Failed to update user profile');

      // Update AuthContext user state and refresh profile data
      await checkAuth();
      await refreshProfile();

      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (isLoading || !profileUser) {
    return <Loading />;
  }

  return (
    <div className='min-h-screen'>
      <div className='container mx-auto p-2'>
        {/* Profile Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='relative mb-8'
        >
          {/* Background Pattern */}
          <div className='absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl'></div>
          <div className='relative p-8 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20'>
            <div className='flex flex-col lg:flex-row items-center gap-8'>
              {/* Profile Image */}
              <motion.div whileHover={{ scale: 1.05 }} className='relative group'>
                <div className='w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1'>
                  <div
                    className='w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden cursor-pointer'
                    onClick={() => profileUser?.avatar && setShowAvatarModal(true)}
                    title='View Avatar'
                  >
                    {profileUser?.avatar || avatarPreview ? (
                      <img
                        src={avatarPreview || profileUser?.avatar}
                        alt={profileUser?.name}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <User className='w-16 h-16 text-gray-400' />
                    )}
                  </div>
                </div>
                {isCurrentUser && (
                  <button
                    onClick={handleCameraClick}
                    disabled={isUploadingAvatar}
                    className='absolute bottom-0 right-0 w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 rounded-full flex items-center justify-center text-white shadow-lg transition-colors'
                  >
                    {isUploadingAvatar ? (
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                    ) : (
                      <Camera className='w-5 h-5' />
                    )}
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleAvatarUpload}
                  className='hidden'
                />
              </motion.div>

              {/* Profile Info */}
              <div className='flex-1 text-center lg:text-left'>
                <div className='flex items-center justify-center lg:justify-start gap-3 mb-4'>
                  <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                    {capitalize(profileUser?.name!)}
                  </h1>
                  {isCurrentUser && <BadgeCheck className='w-6 h-6 text-blue-500' />}
                </div>

                <div className='flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6 text-sm text-gray-600 dark:text-gray-300'>
                  <div className='flex items-center gap-2'>
                    <MapPin className='w-4 h-4' />
                    <span>{locationDisplay}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Trophy className='w-4 h-4' />
                    <span>{profileUser.stats.rank} Rank</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Star className='w-4 h-4' />
                    <span>Level {profileUser.stats.level}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Heart className='w-4 h-4' />
                    <span>{profileUser.stats.credibility}% Credibility</span>
                  </div>
                </div>

                {/* Level Progress */}
                <div className='mb-6'>
                  <div className='flex justify-between text-sm mb-2'>
                    <span>Experience</span>
                    <span>{profileUser.stats.experience}%</span>
                  </div>
                  <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${profileUser.stats.experience}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className='bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full'
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-wrap gap-3 justify-center lg:justify-start'>
                  {isCurrentUser ? (
                    <>
                      <button
                        className='px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2'
                        onClick={() => setShowEditModal(true)}
                      >
                        <Edit3 className='w-4 h-4' />
                        Edit Profile
                      </button>
                      <button
                        onClick={() => router.push('/dashboard/settings')}
                        className='px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors flex items-center gap-2'
                      >
                        <Settings className='w-4 h-4' />
                        Settings
                      </button>
                    </>
                  ) : (
                    <>
                      <FriendButton
                        targetUser={profileUser}
                        onStatusChange={() => {}}
                        className='px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2'
                      />
                      <button
                        onClick={handleMessage}
                        className='px-6 py-2 bg-light-secondary/80 dark:bg-dark-secondary/80 hover:bg-light-secondary/70 dark:hover:bg-dark-secondary/70  text-white rounded-xl font-medium transition-colors flex items-center gap-2'
                      >
                        <MessageCircle className='w-5 h-5' />
                        Message
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8'
        >
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-700'>
            <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3'>
              <Target className='w-6 h-6 text-blue-500' />
            </div>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              {profileUser.stats.gamesPlayed}
            </div>
            <div className='text-sm text-gray-500 dark:text-gray-400'>Games Played</div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-700'>
            <div className='w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3'>
              <Trophy className='w-6 h-6 text-green-500' />
            </div>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              {profileUser.stats.gamesWon}
            </div>
            <div className='text-sm text-gray-500 dark:text-gray-400'>Games Won</div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-700'>
            <div className='w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3'>
              <TrendingUp className='w-6 h-6 text-purple-500' />
            </div>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              {profileUser.stats.winRate}%
            </div>
            <div className='text-sm text-gray-500 dark:text-gray-400'>Win Rate</div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-700'>
            <div className='w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center mx-auto mb-3'>
              <Award className='w-6 h-6 text-yellow-500' />
            </div>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              {profileUser.stats.totalPoints}
            </div>
            <div className='text-sm text-gray-500 dark:text-gray-400'>Total Points</div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-700'>
            <div className='w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mx-auto mb-3'>
              <Heart className='w-6 h-6 text-red-500' />
            </div>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              {profileUser.stats.credibility}%
            </div>
            <div className='text-sm text-gray-500 dark:text-gray-400'>Credibility</div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-700'>
            <div className='w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mx-auto mb-3'>
              <Calendar className='w-6 h-6 text-indigo-500' />
            </div>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
              {profileUser.stats.participation}
            </div>
            <div className='text-sm text-gray-500 dark:text-gray-400'>This Month</div>
          </div>
        </motion.div>

        {/* Tab Navigation - Moved Higher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='mb-8'
        >
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-2 border border-gray-100 dark:border-gray-700'>
            <div className='flex space-x-2'>
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'stats', label: 'Stats', icon: TrendingUp },
                { id: 'achievements', label: 'Achievements', icon: Award },
                { id: 'friends', label: 'Friends', icon: Heart },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className='w-4 h-4' />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {activeTab === 'overview' && (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* Additional Stats */}
              <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700'>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                  Quick Stats
                </h3>
                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600 dark:text-gray-400'>Games Created</span>
                    <span className='font-bold text-gray-900 dark:text-white'>
                      {profileUser.stats.gamesCreated}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600 dark:text-gray-400'>Current Streak</span>
                    <span className='font-bold text-gray-900 dark:text-white'>
                      {profileUser.stats.streak} games
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600 dark:text-gray-400'>Favorite Sport</span>
                    <span className='font-bold text-gray-900 dark:text-white'>
                      {profileUser.stats.favoriteSport}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700'>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                Detailed Statistics
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>Detailed stats coming soon...</p>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700'>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>Achievements</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {profileUser.achievements.achievements.map((achievement) => (
                  <div
                    key={achievement._id}
                    className='p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800'
                  >
                    <div className='text-3xl mb-2'>{achievement.icon}</div>
                    <h4 className='font-bold text-gray-900 dark:text-white mb-1'>
                      {achievement.title}
                    </h4>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
                      {achievement.description}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-500'>
                      Unlocked {achievement.unlockedAt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'friends' && (
            <div className='p-6 '>
              {Array.isArray(profileUser.friends) && profileUser.friends.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {profileUser.friends.map((friend: any) => (
                    <UserCard
                      key={friend._id}
                      user={friend}
                      relationship={currentUser?._id === friend._id ? 'self' : 'friend'}
                      onAddFriend={() => {}}
                      onMessage={() => router.push(`/chat?user=${friend._id}`)}
                      onCardClick={() => router.push(`/profile/${friend._id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className='text-gray-500 dark:text-gray-400 text-center py-8'>
                  No friends yet.
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
      <AvatarModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        avatarUrl={profileUser?.avatar || ''}
        userName={profileUser?.name || ''}
      />
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProfile}
        profileData={profileUser}
      />
    </div>
  );
}
