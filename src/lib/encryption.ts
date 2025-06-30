import crypto from 'crypto';

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

// Generate a random encryption key
export const generateEncryptionKey = (): string => {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
};

// Encrypt a message
export const encryptMessage = (message: string, key: string): string => {
  try {
    // Convert hex key to buffer
    const keyBuffer = Buffer.from(key, 'hex');

    // Generate random IV
    const iv = crypto.randomBytes(IV_LENGTH);

    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
    cipher.setAAD(Buffer.from('lets-play-chat', 'utf8')); // Additional authenticated data

    // Encrypt the message
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Get the auth tag
    const tag = cipher.getAuthTag();

    // Combine IV, encrypted data, and auth tag
    const result = iv.toString('hex') + ':' + encrypted + ':' + tag.toString('hex');

    return result;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt message');
  }
};

// Decrypt a message
export const decryptMessage = (encryptedMessage: string, key: string): string => {
  try {
    // Convert hex key to buffer
    const keyBuffer = Buffer.from(key, 'hex');

    // Split the encrypted message into parts
    const parts = encryptedMessage.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted message format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const tag = Buffer.from(parts[2], 'hex');

    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
    decipher.setAAD(Buffer.from('lets-play-chat', 'utf8')); // Additional authenticated data
    decipher.setAuthTag(tag);

    // Decrypt the message
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt message');
  }
};

// Generate a conversation key for two users
export const generateConversationKey = (userId1: string, userId2: string): string => {
  // Sort user IDs to ensure consistent key generation
  const sortedIds = [userId1, userId2].sort();
  const combined = sortedIds.join(':');

  // Create a hash of the combined user IDs
  const hash = crypto.createHash('sha256').update(combined).digest('hex');

  // Use the hash to generate a deterministic but secure key
  return hash.substring(0, KEY_LENGTH * 2); // 64 characters for 32 bytes
};

// Validate encryption key format
export const isValidEncryptionKey = (key: string): boolean => {
  return /^[a-f0-9]{64}$/.test(key);
};
