import { useAuth } from '@/context/AuthContext';
import { chatApi } from '@/lib/api/chatApi';
import { decryptMessage, generateConversationKey } from '@/lib/encryptionClient';
import { pusherClient } from '@/lib/pusherClient';
import { CHAT_EVENTS, generatePrivateChannelName } from '@/lib/pusherServer';
import { Message, User } from '@/types/user';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface UseRealTimeChatProps {
  selectedFriend: User | null;
  onMessageReceived?: (message: Message) => void;
  onTypingStatusChange?: (isTyping: boolean) => void;
  onMessageStatusChange?: (messageId: string, status: 'delivered' | 'read') => void;
  onOnlineStatusChange?: (userId: string, isOnline: boolean) => void;
}

export const useRealTimeChat = ({
  selectedFriend,
  onMessageReceived,
  onTypingStatusChange,
  onMessageStatusChange,
  onOnlineStatusChange,
}: UseRealTimeChatProps) => {
  const { user: currentUser } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastTypingStatus, setLastTypingStatus] = useState<boolean | null>(null);
  const channelRef = useRef<any>(null);
  const userChannelRef = useRef<any>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if Pusher is configured
  const isPusherConfigured =
    process.env.NEXT_PUBLIC_PUSHER_KEY && process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  // Subscribe to chat channel when friend is selected
  useEffect(() => {
    if (!currentUser?._id || !selectedFriend?._id) {
      console.log('useRealTimeChat: Missing user or friend ID');
      return;
    }

    if (isPusherConfigured) {
      // Use Pusher for real-time updates
      const channelName = generatePrivateChannelName(currentUser._id, selectedFriend._id);
      console.log('useRealTimeChat: Subscribing to channel:', channelName);

      // Subscribe to the private chat channel
      channelRef.current = pusherClient.subscribe(channelName);

      // Listen for new messages
      channelRef.current.bind(CHAT_EVENTS.NEW_MESSAGE, async (data: any) => {
        console.log('useRealTimeChat: Received new message:', data);
        if (data.senderId !== currentUser._id) {
          // Decrypt the message content
          try {
            console.log(
              'useRealTimeChat: Generating conversation key for:',
              currentUser._id,
              selectedFriend._id
            );
            const conversationKey = await generateConversationKey(
              currentUser._id,
              selectedFriend._id
            );
            console.log(
              'useRealTimeChat: Generated key:',
              conversationKey.substring(0, 16) + '...'
            );
            console.log(
              'useRealTimeChat: Encrypted content:',
              data.content.substring(0, 50) + '...'
            );

            const decryptedContent = await decryptMessage(data.content, conversationKey);
            console.log('useRealTimeChat: Decrypted content:', decryptedContent);

            const decryptedMessage: Message = {
              ...data,
              content: decryptedContent,
              createdAt: new Date(data.timestamp),
              updatedAt: new Date(data.timestamp),
            };

            console.log('useRealTimeChat: Calling onMessageReceived with:', decryptedMessage);
            onMessageReceived?.(decryptedMessage);

            // Trigger badge update for new messages
            window.dispatchEvent(new CustomEvent('badge-update'));
          } catch (error) {
            console.error('Failed to decrypt message:', error);
            console.error('Error details:', {
              senderId: data.senderId,
              receiverId: data.receiverId,
              currentUserId: currentUser._id,
              selectedFriendId: selectedFriend._id,
              encryptedContent: data.content,
            });
            toast.error('Failed to decrypt message');
          }
        } else {
          console.log('useRealTimeChat: Ignoring own message');
        }
      });

      // Listen for typing status
      channelRef.current.bind(CHAT_EVENTS.TYPING_START, (data: any) => {
        console.log('useRealTimeChat: Typing start:', data);
        if (data.userId !== currentUser._id) {
          setIsTyping(true);
          onTypingStatusChange?.(true);
        }
      });

      channelRef.current.bind(CHAT_EVENTS.TYPING_STOP, (data: any) => {
        console.log('useRealTimeChat: Typing stop:', data);
        if (data.userId !== currentUser._id) {
          setIsTyping(false);
          onTypingStatusChange?.(false);
        }
      });

      // Listen for message status updates
      channelRef.current.bind(CHAT_EVENTS.MESSAGE_DELIVERED, (data: any) => {
        console.log('useRealTimeChat: Message delivered:', data);
        onMessageStatusChange?.(data.messageId, data.status);

        // Trigger badge update when messages are read
        if (data.status === 'read') {
          window.dispatchEvent(new CustomEvent('badge-update'));
        }
      });

      // Listen for message edits
      channelRef.current.bind('message-edited', async (data: any) => {
        console.log('useRealTimeChat: Message edited:', data);
        try {
          const conversationKey = await generateConversationKey(
            currentUser._id,
            selectedFriend._id
          );
          const decryptedContent = await decryptMessage(data.content, conversationKey);

          onMessageReceived?.({
            _id: data.messageId,
            senderId: data.senderId,
            receiverId: data.receiverId,
            content: decryptedContent,
            messageType: data.messageType || 'text',
            isRead: data.isRead || false,
            isEdited: true,
            editedAt: new Date(data.editedAt),
            createdAt: new Date(data.timestamp),
            updatedAt: new Date(data.timestamp),
          } as Message);
        } catch (error) {
          console.error('Failed to decrypt edited message:', error);
        }
      });

      // Listen for message deletions
      channelRef.current.bind('message-deleted', (data: any) => {
        console.log('useRealTimeChat: Message deleted:', data);
        // Handle message deletion in the UI
        // You might want to emit a custom event or use a callback
      });

      return () => {
        console.log('useRealTimeChat: Unsubscribing from channel:', channelName);
        if (channelRef.current) {
          pusherClient.unsubscribe(channelName);
          channelRef.current = null;
        }
      };
    } else {
      // Fallback: Use polling for real-time updates
      console.log('useRealTimeChat: Pusher not configured, using polling fallback');

      const pollForNewMessages = async () => {
        try {
          const messages = await chatApi.getMessages(selectedFriend._id, currentUser._id);
          if (messages && messages.length > 0) {
            // Check if we have new messages
            const latestMessage = messages[0]; // Newest first from API
            onMessageReceived?.(latestMessage);
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      };

      // Poll every 3 seconds
      pollingIntervalRef.current = setInterval(pollForNewMessages, 3000);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      };
    }
  }, [
    currentUser?._id,
    selectedFriend?._id,
    onMessageReceived,
    onTypingStatusChange,
    onMessageStatusChange,
    isPusherConfigured,
  ]);

  // Subscribe to user's personal channel for status updates
  useEffect(() => {
    if (!currentUser?._id || !isPusherConfigured) {
      return;
    }

    const userChannelName = `user-${currentUser._id}`;
    userChannelRef.current = pusherClient.subscribe(userChannelName);

    // Listen for online/offline status updates
    userChannelRef.current.bind(CHAT_EVENTS.USER_ONLINE, (data: any) => {
      // Handle user online status
      onOnlineStatusChange?.(data.userId, true);
    });

    userChannelRef.current.bind(CHAT_EVENTS.USER_OFFLINE, (data: any) => {
      // Handle user offline status
      onOnlineStatusChange?.(data.userId, false);
    });

    return () => {
      if (userChannelRef.current) {
        pusherClient.unsubscribe(userChannelName);
        userChannelRef.current = null;
      }
    };
  }, [currentUser?._id, onOnlineStatusChange, isPusherConfigured]);

  // Handle Pusher connection status
  useEffect(() => {
    if (!isPusherConfigured) {
      return;
    }

    const handleConnected = () => {
      console.log('PusherClient: Connected to Pusher');
      setIsConnected(true);
    };

    const handleDisconnected = () => {
      console.log('PusherClient: Disconnected from Pusher');
      setIsConnected(false);
    };

    const handleError = (error: any) => {
      console.error('PusherClient: Connection error:', error);
    };

    pusherClient.connection.bind('connected', handleConnected);
    pusherClient.connection.bind('disconnected', handleDisconnected);
    pusherClient.connection.bind('error', handleError);

    return () => {
      pusherClient.connection.unbind('connected', handleConnected);
      pusherClient.connection.unbind('disconnected', handleDisconnected);
      pusherClient.connection.unbind('error', handleError);
    };
  }, [isPusherConfigured]);

  // Send typing status
  const sendTypingStatus = useCallback(
    async (isTyping: boolean) => {
      if (!currentUser?._id || !selectedFriend?._id) {
        return;
      }

      // Prevent duplicate calls with the same status
      if (lastTypingStatus === isTyping) {
        return;
      }

      try {
        await chatApi.sendTypingStatus({
          userId: currentUser._id,
          friendId: selectedFriend._id,
          isTyping,
        });

        setLastTypingStatus(isTyping);

        // Clear existing timeout
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }

        // Set timeout to stop typing status after 3 seconds
        if (isTyping) {
          const timeout = setTimeout(() => {
            sendTypingStatus(false);
          }, 3000);
          setTypingTimeout(timeout);
        } else {
          setTypingTimeout(null);
        }
      } catch (error) {
        console.error('Failed to send typing status:', error);
      }
    },
    [currentUser?._id, selectedFriend?._id, typingTimeout, lastTypingStatus]
  );

  // Send message
  const sendMessage = useCallback(
    async (content: string, messageType: 'text' | 'image' | 'file' | 'audio' = 'text') => {
      if (!currentUser?._id || !selectedFriend?._id || !content.trim()) {
        return null;
      }

      try {
        // Stop typing status
        await sendTypingStatus(false);

        const message = await chatApi.sendMessage(
          selectedFriend._id,
          {
            content: content.trim(),
            messageType,
          },
          currentUser._id
        );

        return message;
      } catch (error) {
        console.error('Failed to send message:', error);
        toast.error('Failed to send message');
        return null;
      }
    },
    [currentUser?._id, selectedFriend?._id, sendTypingStatus]
  );

  // Edit message
  const editMessage = useCallback(
    async (messageId: string, newContent: string) => {
      if (!currentUser?._id || !newContent.trim()) {
        return null;
      }

      try {
        const message = await chatApi.editMessage(messageId, {
          userId: currentUser._id,
          content: newContent.trim(),
        });

        return message;
      } catch (error) {
        console.error('Failed to edit message:', error);
        toast.error('Failed to edit message');
        return null;
      }
    },
    [currentUser?._id]
  );

  // Delete message
  const deleteMessage = useCallback(
    async (messageId: string) => {
      if (!currentUser?._id) {
        return false;
      }

      try {
        await chatApi.deleteMessage(messageId, currentUser._id);
        return true;
      } catch (error) {
        console.error('Failed to delete message:', error);
        toast.error('Failed to delete message');
        return false;
      }
    },
    [currentUser?._id]
  );

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!currentUser?._id || !selectedFriend?._id) {
      return;
    }

    try {
      await chatApi.markAsRead(currentUser._id, selectedFriend._id);
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  }, [currentUser?._id, selectedFriend?._id]);

  return {
    isConnected,
    isTyping,
    sendMessage,
    sendTypingStatus,
    editMessage,
    deleteMessage,
    markAsRead,
  };
};
