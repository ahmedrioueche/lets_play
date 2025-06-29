import { useAuth } from '@/context/AuthContext';
import { useFriendInvitations } from '@/hooks/useFriendInvitations';
import useTranslator from '@/hooks/useTranslator';
import { friendsApi } from '@/lib/api/friendsApi';
import { UserProfile } from '@/types/user';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface FriendButtonProps {
  targetUser: UserProfile;
  className?: string;
  onStatusChange?: (status: string) => void;
}

const FriendButton: React.FC<FriendButtonProps> = ({
  targetUser,
  className = '',
  onStatusChange,
}) => {
  const { user: currentUser } = useAuth();
  const text = useTranslator();
  const [isLoading, setIsLoading] = useState(false);

  const {
    getInvitationStatus,
    getInvitationId,
    sendInvitation,
    respondToInvitation,
    cancelInvitation,
    clearCache,
    loading,
  } = useFriendInvitations(currentUser?._id || '');

  // Get the correct user ID (handle both User and UserProfile objects)
  const targetUserId = targetUser.userId || targetUser._id;

  // Don't show button if no user or if it's the same user
  if (!currentUser || currentUser._id === targetUserId) {
    return null;
  }

  // Get current invitation status
  const invitationStatus = getInvitationStatus(targetUserId);

  console.log('FriendButton render:', {
    targetUserId,
    currentUserId: currentUser?._id,
    invitationStatus,
    loading,
  });

  // Don't show button if data is still loading
  if (loading) {
    return (
      <button
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-300 text-gray-500 ${className}`}
        disabled={true}
      >
        Loading...
      </button>
    );
  }

  const handleSendInvitation = async () => {
    setIsLoading(true);
    try {
      const result = await sendInvitation(targetUserId);
      if (result?.success) {
        onStatusChange?.('invitation_sent');
        toast.success(`Friend invitation sent to ${targetUser.name}!`);
      } else {
        toast.error(result?.error || 'Failed to send friend invitation');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send friend invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    const invitationId = getInvitationId(targetUserId);
    if (!invitationId) return;

    setIsLoading(true);
    try {
      const result = await respondToInvitation(invitationId, 'accept');
      if (result?.success) {
        onStatusChange?.('friends');
        toast.success(`You are now friends with ${targetUser.name}!`);
      } else {
        toast.error(result?.error || 'Failed to accept friend invitation');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast.error('Failed to accept friend invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineInvitation = async () => {
    const invitationId = getInvitationId(targetUserId);
    if (!invitationId) return;

    setIsLoading(true);
    try {
      const result = await respondToInvitation(invitationId, 'decline');
      if (result?.success) {
        onStatusChange?.('none');
        toast.success('Friend invitation declined');
      } else {
        toast.error(result?.error || 'Failed to decline friend invitation');
      }
    } catch (error) {
      console.error('Error declining invitation:', error);
      toast.error('Failed to decline friend invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelInvitation = async () => {
    const invitationId = getInvitationId(targetUserId);
    if (!invitationId) return;

    setIsLoading(true);
    try {
      const result = await cancelInvitation(invitationId);
      if (result?.success) {
        onStatusChange?.('none');
        toast.success('Friend invitation cancelled');
      } else {
        toast.error(result?.error || 'Failed to cancel friend invitation');
      }
    } catch (error) {
      console.error('Error canceling invitation:', error);
      toast.error('Failed to cancel friend invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    setIsLoading(true);
    try {
      await friendsApi.removeFriend(currentUser._id, targetUserId);
      clearCache(); // Clear the cache to force fresh data
      onStatusChange?.('none');
      toast.success(`Removed ${targetUser.name} from friends`);
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error('Failed to remove friend');
    } finally {
      setIsLoading(false);
    }
  };

  const baseClasses =
    'px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  switch (invitationStatus) {
    case 'friends':
      return (
        <div className='flex gap-2'>
          <button
            className={`${baseClasses} bg-green-100 dark:bg-green-700 text-green-600 dark:text-green-300 ${className}`}
            disabled={isLoading}
          >
            Friends
          </button>
          <button
            onClick={handleRemoveFriend}
            className={`${baseClasses} bg-red-500 text-white hover:bg-red-600 ${className}`}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Remove'}
          </button>
        </div>
      );

    case 'invitation_sent':
      return (
        <div className='flex gap-2'>
          <button
            className={`${baseClasses} bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 ${className}`}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Invitation Sent'}
          </button>
          <button
            onClick={handleCancelInvitation}
            className={`${baseClasses} bg-red-500 text-white hover:bg-red-600 ${className}`}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      );

    case 'invitation_received':
      return (
        <div className='flex gap-2'>
          <button
            onClick={handleAcceptInvitation}
            className={`${baseClasses} bg-green-500 text-white hover:bg-green-600 ${className}`}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Accept'}
          </button>
          <button
            onClick={handleDeclineInvitation}
            className={`${baseClasses} bg-red-500 text-white hover:bg-red-600 ${className}`}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Decline'}
          </button>
        </div>
      );

    default:
      return (
        <button
          onClick={handleSendInvitation}
          className={`${baseClasses} bg-blue-500 text-white hover:bg-blue-600 ${className}`}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Add Friend'}
        </button>
      );
  }
};

export default FriendButton;
