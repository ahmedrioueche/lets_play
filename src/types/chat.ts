export interface Conversation {
  _id: string;
  friendId: string;
  friendName: string;
  friendAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'audio';
  isRead: boolean;
  isEdited: boolean;
  editedAt?: Date;
  replyTo?: string;
  createdAt: Date;
  updatedAt: Date;
  // Encryption fields
  isEncrypted?: boolean;
  encryptionKey?: string;
  // Message status tracking
  deliveredAt?: Date;
  readAt?: Date;
  // Metadata for better performance
  conversationId?: string;
}
