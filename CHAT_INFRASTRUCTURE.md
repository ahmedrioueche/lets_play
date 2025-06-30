# Chat Infrastructure Documentation

## Overview

The chat system is built with a focus on security, real-time communication, and scalability. It uses end-to-end encryption, Pusher for real-time updates, and a robust backend service architecture.

## Architecture

### Components

1. **Encryption Layer** (`src/lib/encryption.ts`)

   - AES-256-GCM encryption for message content
   - Per-conversation encryption keys
   - Secure key generation and management

2. **Real-time Communication** (`src/lib/pusherServer.ts`, `src/lib/pusherClient.ts`)

   - Pusher integration for real-time messaging
   - Private channels for secure communication
   - Typing indicators and message status updates

3. **Chat Service** (`src/lib/services/chatService.ts`)

   - Centralized business logic for chat operations
   - Message encryption/decryption
   - Conversation management
   - Real-time event handling

4. **API Layer** (`src/app/api/chat/`)

   - RESTful endpoints for chat operations
   - Secure authentication and authorization
   - Error handling and validation

5. **Client Hooks** (`src/hooks/useRealTimeChat.ts`)
   - React hooks for real-time chat functionality
   - Automatic message decryption
   - Typing status management
   - Connection state management

## Security Features

### Message Encryption

- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Generation**: Deterministic per conversation using user IDs
- **Storage**: Encrypted messages stored in database
- **Transmission**: Encrypted content sent via Pusher

```typescript
// Example encryption flow
const conversationKey = generateConversationKey(userId1, userId2);
const encryptedContent = encryptMessage(plainText, conversationKey);
// Store encryptedContent in database
```

### Authentication & Authorization

- Private Pusher channels require authentication
- Friend-only messaging (users must be friends to chat)
- Message ownership validation for edit/delete operations

## Real-time Features

### Message Events

- **New Message**: Instant delivery with encryption
- **Message Edit**: Real-time updates for edited messages
- **Message Delete**: Instant removal from all clients
- **Typing Indicators**: Real-time typing status
- **Message Status**: Delivery and read receipts

### Channel Structure

```typescript
// Private chat channels
`private-chat-${sortedUserIds.join('-')}` // User status channels
`private-user-${userId}`;
```

## API Endpoints

### Core Chat Operations

```typescript
// Get conversation messages
GET /api/chat/[friendId]?userId=[userId]&page=[page]&limit=[limit]

// Send a message
POST /api/chat/[friendId]
{
  "content": "Hello!",
  "senderId": "user123",
  "messageType": "text",
  "replyTo": "optional-message-id"
}

// Send typing status
POST /api/chat/typing
{
  "userId": "user123",
  "friendId": "user456",
  "isTyping": true
}
```

### Message Management

```typescript
// Edit message
PUT /api/chat/messages/[messageId]
{
  "userId": "user123",
  "content": "Updated message"
}

// Delete message
DELETE /api/chat/messages/[messageId]?userId=[userId]

// Mark messages as read
POST /api/chat/[friendId]/read
{
  "userId": "user123"
}
```

### Conversation Management

```typescript
// Get recent conversations
GET /api/chat/conversations?userId=[userId]&limit=[limit]
```

## Database Schema

### Message Model

```typescript
interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string; // Encrypted
  messageType: 'text' | 'image' | 'file' | 'audio';
  isRead: boolean;
  isEdited: boolean;
  editedAt?: Date;
  replyTo?: string;
  // Encryption fields
  isEncrypted?: boolean;
  encryptionKey?: string;
  // Status tracking
  deliveredAt?: Date;
  readAt?: Date;
  // Performance optimization
  conversationId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Indexes

- `{ senderId: 1, receiverId: 1, createdAt: -1 }`
- `{ receiverId: 1, isRead: 1 }`
- `{ conversationId: 1, createdAt: -1 }`
- `{ conversationId: 1, isRead: 1 }`

## Client Usage

### Basic Setup

```typescript
import { useRealTimeChat } from '@/hooks/useRealTimeChat';

const ChatComponent = () => {
  const {
    isConnected,
    isTyping,
    sendMessage,
    sendTypingStatus,
    editMessage,
    deleteMessage,
    markAsRead,
  } = useRealTimeChat({
    selectedFriend,
    onMessageReceived: (message) => {
      // Handle new message
    },
    onTypingStatusChange: (isTyping) => {
      // Handle typing status
    },
  });

  // Use the functions...
};
```

### Sending Messages

```typescript
const handleSend = async (content: string) => {
  const message = await sendMessage(content);
  if (message) {
    // Message sent successfully
  }
};
```

### Typing Indicators

```typescript
const handleTyping = (isTyping: boolean) => {
  sendTypingStatus(isTyping);
};
```

## Environment Variables

```env
# Pusher Configuration
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
PUSHER_APP_ID=your_app_id
PUSHER_SECRET=your_secret

# Database
MONGODB_URI=your_mongodb_uri
```

## Performance Optimizations

### Database

- Compound indexes for efficient querying
- Conversation ID for faster message retrieval
- Pagination support for large conversations

### Real-time

- Private channels for security
- Event batching for high-frequency updates
- Connection state management

### Client

- Message caching and state management
- Optimistic updates for better UX
- Automatic reconnection handling

## Error Handling

### Common Error Scenarios

1. **Encryption Errors**: Fallback to encrypted message display
2. **Network Issues**: Automatic reconnection and retry logic
3. **Authorization Errors**: Clear error messages and redirects
4. **Rate Limiting**: Graceful degradation and user feedback

### Error Recovery

- Automatic message retry on failure
- Connection state monitoring
- Graceful degradation for offline scenarios

## Security Considerations

### Best Practices

1. **Key Management**: Never store encryption keys in plain text
2. **Channel Security**: Validate all Pusher channel subscriptions
3. **Input Validation**: Sanitize all user inputs
4. **Rate Limiting**: Implement API rate limiting
5. **Audit Logging**: Log all chat operations for security

### Privacy Features

- End-to-end encryption for all messages
- No message content stored in plain text
- Automatic message expiration (configurable)
- User-controlled message deletion

## Scalability

### Horizontal Scaling

- Stateless API design
- Database connection pooling
- Pusher handles real-time scaling
- CDN for static assets

### Performance Monitoring

- Message delivery metrics
- Encryption/decryption performance
- Database query optimization
- Real-time connection monitoring

## Future Enhancements

### Planned Features

1. **File Sharing**: Encrypted file upload and sharing
2. **Voice Messages**: Audio message support
3. **Group Chats**: Multi-user conversations
4. **Message Reactions**: Emoji reactions to messages
5. **Advanced Search**: Encrypted message search
6. **Message Backup**: Encrypted backup system

### Technical Improvements

1. **WebRTC Integration**: Peer-to-peer messaging
2. **Message Queuing**: Reliable message delivery
3. **Advanced Encryption**: Perfect forward secrecy
4. **Offline Support**: Message synchronization
5. **Push Notifications**: Mobile notification support

## Troubleshooting

### Common Issues

1. **Messages not appearing**: Check Pusher connection and encryption
2. **Typing indicators not working**: Verify channel subscription
3. **Encryption errors**: Check key generation and storage
4. **Performance issues**: Monitor database indexes and queries

### Debug Tools

- Pusher debug console
- Database query monitoring
- Encryption key validation
- Network request logging

## Support

For technical support or questions about the chat infrastructure, please refer to the development team or create an issue in the project repository.
