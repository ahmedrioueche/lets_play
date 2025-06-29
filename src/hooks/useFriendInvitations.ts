import { friendInvitationsApi } from '@/lib/api/friendInvitationsApi';
import { friendsApi } from '@/lib/api/friendsApi';
import { pusherClient } from '@/lib/pusherClient';
import { FriendInvitation } from '@/types/user';
import { useCallback, useEffect, useRef, useState } from 'react';

// Simple cache to prevent duplicate API calls
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

// Global flag to prevent multiple simultaneous fetches
let isFetching = false;

export const useFriendInvitations = (userId: string) => {
  console.log('useFriendInvitations hook called with userId:', userId);

  const [invitations, setInvitations] = useState<FriendInvitation[]>([]);
  const [sentInvitations, setSentInvitations] = useState<FriendInvitation[]>([]);
  const [receivedInvitations, setReceivedInvitations] = useState<FriendInvitation[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<number>(0);
  const isInitializedRef = useRef<boolean>(false);
  const lastUserIdRef = useRef<string>('');

  const fetchInvitations = useCallback(
    async (forceRefresh = false) => {
      if (!userId || userId === '' || userId === 'undefined' || userId === 'null') {
        console.log('fetchInvitations: No valid userId provided');
        return;
      }

      // Prevent multiple simultaneous fetches
      if (isFetching) {
        console.log('fetchInvitations: Already fetching, skipping');
        return;
      }

      isFetching = true;
      setLoading(true);
      setError(null);

      try {
        const now = Date.now();
        const cacheKey = `friend-invitations-${userId}`;
        const cached = cache.get(cacheKey);

        // Use cache if available and not expired (1 minute instead of 5)
        if (
          !forceRefresh &&
          cached &&
          typeof cached.timestamp === 'number' &&
          now - cached.timestamp < 1 * 60 * 1000
        ) {
          console.log('fetchInvitations: Using cached data for user:', userId);
          const result = cached.data;

          // Process the invitations to handle populated objects
          const processInvitations = (invitations: any[]) => {
            return invitations.map((inv: any) => ({
              _id: inv._id,
              fromUserId:
                inv.fromUserId?._id?.toString() || inv.fromUserId?.toString() || inv.fromUserId,
              toUserId: inv.toUserId?._id?.toString() || inv.toUserId?.toString() || inv.toUserId,
              status: inv.status,
              createdAt: inv.createdAt,
              updatedAt: inv.updatedAt,
            }));
          };

          const processedInvitations = processInvitations(result.invitations);
          const processedSent = processInvitations(result.sentInvitations);
          const processedReceived = processInvitations(result.receivedInvitations);

          setInvitations(processedInvitations);
          setSentInvitations(processedSent);
          setReceivedInvitations(processedReceived);
          setFriends(result.friends);
          setLoading(false);
          isFetching = false;
          return;
        }

        console.log('fetchInvitations: Fetching fresh data for user:', userId);

        // Fetch all data in parallel
        const [allInvitations, sent, received, friendsData] = await Promise.all([
          friendInvitationsApi.getInvitations(userId),
          friendInvitationsApi.getInvitations(userId, 'sent'),
          friendInvitationsApi.getInvitations(userId, 'received'),
          friendsApi.getFriends(userId),
        ]);

        console.log('fetchInvitations: API results:', {
          allInvitations: allInvitations?.length || 0,
          sent: sent?.length || 0,
          received: received?.length || 0,
          friends: friendsData?.length || 0,
          friendsDataRaw: friendsData, // Add raw data for debugging
        });

        const result = {
          invitations: allInvitations || [],
          sentInvitations: sent || [],
          receivedInvitations: received || [],
          friends: (friendsData || []).map((friend: any) => {
            // Handle both User objects and string IDs
            if (typeof friend === 'string') {
              return friend;
            }
            if (friend && friend._id) {
              return friend._id.toString();
            }
            return friend;
          }),
        };

        // Process the invitations to handle populated objects
        const processInvitations = (invitations: any[]) => {
          return invitations.map((inv: any) => ({
            _id: inv._id,
            fromUserId:
              inv.fromUserId?._id?.toString() || inv.fromUserId?.toString() || inv.fromUserId,
            toUserId: inv.toUserId?._id?.toString() || inv.toUserId?.toString() || inv.toUserId,
            status: inv.status,
            createdAt: inv.createdAt,
            updatedAt: inv.updatedAt,
          }));
        };

        const processedInvitations = processInvitations(result.invitations);
        const processedSent = processInvitations(result.sentInvitations);
        const processedReceived = processInvitations(result.receivedInvitations);

        console.log('fetchInvitations: Processed results:', {
          invitations: processedInvitations.length,
          sent: processedSent.length,
          received: processedReceived.length,
          friends: result.friends.length,
          processedFriends: result.friends, // Add processed friends for debugging
        });

        setInvitations(processedInvitations);
        setSentInvitations(processedSent);
        setReceivedInvitations(processedReceived);
        setFriends(result.friends);

        // Cache the result
        cache.set(cacheKey, { data: result, timestamp: now });
        isInitializedRef.current = true;
        lastUserIdRef.current = userId;
      } catch (err) {
        console.error('Error fetching friend invitations:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch invitations');
        // Set empty arrays on error to prevent undefined issues
        setInvitations([]);
        setSentInvitations([]);
        setReceivedInvitations([]);
        setFriends([]);
      } finally {
        setLoading(false);
        isFetching = false;
      }
    },
    [userId]
  );

  // Real-time updates for friend invitations
  useEffect(() => {
    if (!userId || userId === '' || userId === 'undefined' || userId === 'null') {
      return;
    }

    console.log('Setting up Pusher subscriptions for user:', userId);
    const channel = pusherClient.subscribe(`user-${userId}`);

    // Listen for new friend invitations
    channel.bind('friend-invitation', (notification: any) => {
      console.log('Received friend-invitation event:', notification);
      // Clear cache and refresh to get latest data
      cache.delete(`friend-invitations-${userId}`);
      fetchInvitations(true);
    });

    // Listen for friend invitation responses
    channel.bind('friend-response', (notification: any) => {
      console.log('Received friend-response event:', notification);
      // Clear cache and refresh to get latest data
      cache.delete(`friend-invitations-${userId}`);
      fetchInvitations(true);
    });

    // Listen for friend invitation cancellations
    channel.bind('friend-invitation-cancelled', (data: any) => {
      console.log('Received friend-invitation-cancelled event:', data);
      // Clear cache and refresh to get latest data
      cache.delete(`friend-invitations-${userId}`);
      fetchInvitations(true);
    });

    // Listen for friend removals
    channel.bind('friend-removed', (data: any) => {
      console.log('Received friend-removed event:', data);
      // Clear cache and refresh to get latest data
      cache.delete(`friend-invitations-${userId}`);
      fetchInvitations(true);
    });

    // Listen for new friendships
    channel.bind('friend-added', (data: any) => {
      console.log('Received friend-added event:', data);
      // Clear cache and refresh to get latest data
      cache.delete(`friend-invitations-${userId}`);
      fetchInvitations(true);
    });

    return () => {
      console.log('Cleaning up Pusher subscriptions for user:', userId);
      pusherClient.unsubscribe(`user-${userId}`);
    };
  }, [userId]); // Removed fetchInvitations dependency to prevent infinite loops

  // Only fetch once on mount - removed fetchInvitations dependency
  useEffect(() => {
    // Always fetch if we have a valid userId
    if (userId && userId !== '' && userId !== 'undefined' && userId !== 'null') {
      console.log('fetchInvitations: Initial fetch for user:', userId);
      isInitializedRef.current = false; // Reset initialization flag
      fetchInvitations();
    }
  }, [userId]); // Removed fetchInvitations from dependencies

  const sendInvitation = useCallback(
    async (toUserId: string) => {
      if (!userId || userId === '' || userId === 'undefined' || userId === 'null') {
        return { success: false, error: 'No user ID' };
      }

      setLoading(true);
      setError(null);

      try {
        const result = await friendInvitationsApi.sendInvitation(userId, toUserId);

        // Clear cache and refresh to get the latest data
        cache.delete(`friend-invitations-${userId}`);
        await fetchInvitations(true);

        return { success: true, data: result };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send invitation';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [userId, fetchInvitations]
  );

  const respondToInvitation = useCallback(
    async (invitationId: string, action: 'accept' | 'decline') => {
      if (!userId || userId === '' || userId === 'undefined' || userId === 'null') {
        return { success: false, error: 'No user ID' };
      }

      setLoading(true);
      setError(null);

      try {
        const result = await friendInvitationsApi.respondToInvitation(invitationId, action, userId);

        // Clear cache and refresh
        cache.delete(`friend-invitations-${userId}`);
        await fetchInvitations(true);

        return { success: true, data: result };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to respond to invitation';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [userId, fetchInvitations]
  );

  const cancelInvitation = useCallback(
    async (invitationId: string) => {
      if (!userId || userId === '' || userId === 'undefined' || userId === 'null') {
        return { success: false, error: 'No user ID' };
      }

      setLoading(true);
      setError(null);

      try {
        const result = await friendInvitationsApi.cancelInvitation(invitationId, userId);

        // Clear cache and refresh
        cache.delete(`friend-invitations-${userId}`);
        await fetchInvitations(true);

        return { success: true, data: result };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to cancel invitation';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [userId, fetchInvitations]
  );

  const getInvitationStatus = useCallback(
    (otherUserId: string) => {
      if (!otherUserId) return 'none';

      console.log('getInvitationStatus called with:', {
        otherUserId,
        friends: friends.length,
        sentInvitations: sentInvitations.length,
        receivedInvitations: receivedInvitations.length,
        friendsList: friends,
        sentList: sentInvitations,
        receivedList: receivedInvitations,
      });

      // First check if they are already friends
      const isFriend = friends.some((friendId) => {
        const friendIdStr = friendId?.toString() || friendId;
        const otherUserIdStr = otherUserId?.toString() || otherUserId;
        const matches = friendIdStr === otherUserIdStr;
        console.log('Checking friend relationship:', {
          friendIdStr,
          otherUserIdStr,
          matches,
        });
        return matches;
      });

      if (isFriend) {
        console.log('Found friend relationship');
        return 'friends';
      }

      // Check if there's a pending invitation sent by current user
      const sentInvitation = sentInvitations.find((inv) => {
        const invToUserId = inv.toUserId?.toString() || inv.toUserId;
        const otherUserIdStr = otherUserId?.toString() || otherUserId;
        const matches = invToUserId === otherUserIdStr && inv.status === 'pending';
        console.log('Checking sent invitation:', {
          invToUserId,
          otherUserIdStr,
          status: inv.status,
          matches,
        });
        return matches;
      });
      if (sentInvitation) {
        console.log('Found sent invitation:', sentInvitation);
        return 'invitation_sent';
      }

      // Check if there's a pending invitation received from other user
      const receivedInvitation = receivedInvitations.find((inv) => {
        const invFromUserId = inv.fromUserId?.toString() || inv.fromUserId;
        const otherUserIdStr = otherUserId?.toString() || otherUserId;
        const matches = invFromUserId === otherUserIdStr && inv.status === 'pending';
        console.log('Checking received invitation:', {
          invFromUserId,
          otherUserIdStr,
          status: inv.status,
          matches,
        });
        return matches;
      });
      if (receivedInvitation) {
        console.log('Found received invitation:', receivedInvitation);
        return 'invitation_received';
      }

      console.log('No invitation status found, returning none');
      return 'none';
    },
    [sentInvitations, receivedInvitations, friends]
  );

  const getInvitationId = useCallback(
    (otherUserId: string) => {
      if (!otherUserId) return null;

      // Check sent invitations
      const sentInvitation = sentInvitations.find((inv) => {
        const invToUserId = inv.toUserId?.toString() || inv.toUserId;
        const otherUserIdStr = otherUserId?.toString() || otherUserId;
        return invToUserId === otherUserIdStr && inv.status === 'pending';
      });
      if (sentInvitation) return sentInvitation._id;

      // Check received invitations
      const receivedInvitation = receivedInvitations.find((inv) => {
        const invFromUserId = inv.fromUserId?.toString() || inv.fromUserId;
        const otherUserIdStr = otherUserId?.toString() || otherUserId;
        return invFromUserId === otherUserIdStr && inv.status === 'pending';
      });
      if (receivedInvitation) return receivedInvitation._id;

      return null;
    },
    [sentInvitations, receivedInvitations]
  );

  return {
    invitations,
    sentInvitations,
    receivedInvitations,
    friends,
    loading,
    error,
    sendInvitation,
    respondToInvitation,
    cancelInvitation,
    getInvitationStatus,
    getInvitationId,
    refresh: () => {
      cache.delete(`friend-invitations-${userId}`);
      return fetchInvitations(true);
    },
    clearCache: () => {
      cache.delete(`friend-invitations-${userId}`);
    },
  };
};
