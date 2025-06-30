import Pusher from 'pusher';

// Check if Pusher environment variables are set
const appId = process.env.PUSHER_APP_ID;
const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
const secret = process.env.PUSHER_SECRET;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

if (!appId || !key || !secret || !cluster) {
  console.error('Pusher environment variables are missing!');
  console.error('PUSHER_APP_ID:', appId ? 'SET' : 'MISSING');
  console.error('NEXT_PUBLIC_PUSHER_KEY:', key ? 'SET' : 'MISSING');
  console.error('PUSHER_SECRET:', secret ? 'SET' : 'MISSING');
  console.error('NEXT_PUBLIC_PUSHER_CLUSTER:', cluster ? 'SET' : 'MISSING');
}

// Server-side Pusher configuration
export const pusherServer = new Pusher({
  appId: appId!,
  key: key!,
  secret: secret!,
  cluster: cluster!,
  useTLS: true,
});

/**
 * Generate a unique channel name for a conversation between two users
 * Using public channels to avoid authentication complexity
 */
export const generatePrivateChannelName = (userId1: string, userId2: string): string => {
  // Sort user IDs to ensure consistent channel name regardless of who initiates
  const sortedIds = [userId1, userId2].sort();
  return `chat-${sortedIds[0]}-${sortedIds[1]}`;
};

// User channel name generator
export const generateUserChannelName = (userId: string): string => {
  return `user-${userId}`;
};

// Event types for type safety
export const CHAT_EVENTS = {
  NEW_MESSAGE: 'new-message',
  MESSAGE_READ: 'message-read',
  TYPING_START: 'typing-start',
  TYPING_STOP: 'typing-stop',
  USER_ONLINE: 'user-online',
  USER_OFFLINE: 'user-offline',
  MESSAGE_DELIVERED: 'message-delivered',
} as const;

// Pusher event payload types
export interface ChatMessagePayload {
  messageId: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'audio';
  timestamp: string;
  isEncrypted: boolean;
}

export interface TypingPayload {
  userId: string;
  friendId: string;
  isTyping: boolean;
}

export interface MessageStatusPayload {
  messageId: string;
  status: 'delivered' | 'read';
  timestamp: string;
}

// Helper functions for sending events
export const sendChatMessage = async (
  channelName: string,
  payload: ChatMessagePayload
): Promise<void> => {
  try {
    console.log('PusherServer: Triggering event on channel:', channelName);
    console.log('PusherServer: Event:', CHAT_EVENTS.NEW_MESSAGE);
    console.log('PusherServer: Payload:', payload);

    await pusherServer.trigger(channelName, CHAT_EVENTS.NEW_MESSAGE, payload);
    console.log('PusherServer: Event triggered successfully');
  } catch (error) {
    console.error('Error sending chat message via Pusher:', error);
    throw error;
  }
};

export const sendTypingStatus = async (
  channelName: string,
  payload: TypingPayload
): Promise<void> => {
  try {
    const event = payload.isTyping ? CHAT_EVENTS.TYPING_START : CHAT_EVENTS.TYPING_STOP;
    await pusherServer.trigger(channelName, event, payload);
  } catch (error) {
    console.error('Error sending typing status via Pusher:', error);
    throw error;
  }
};

export const sendMessageStatus = async (
  channelName: string,
  payload: MessageStatusPayload
): Promise<void> => {
  try {
    await pusherServer.trigger(channelName, CHAT_EVENTS.MESSAGE_DELIVERED, payload);
  } catch (error) {
    console.error('Error sending message status via Pusher:', error);
    throw error;
  }
};

export const sendUserStatus = async (userId: string, isOnline: boolean): Promise<void> => {
  try {
    const channelName = generateUserChannelName(userId);
    const event = isOnline ? CHAT_EVENTS.USER_ONLINE : CHAT_EVENTS.USER_OFFLINE;
    await pusherServer.trigger(channelName, event, { userId, isOnline });
  } catch (error) {
    console.error('Error sending user status via Pusher:', error);
    throw error;
  }
};
