// Browser-compatible encryption utilities using Web Crypto API

// Convert hex string to ArrayBuffer
function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer;
}

// Convert ArrayBuffer to hex string
function arrayBufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

// Convert string to ArrayBuffer
function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(str);
  return uint8Array.buffer.slice(
    uint8Array.byteOffset,
    uint8Array.byteOffset + uint8Array.byteLength
  ) as ArrayBuffer;
}

// Convert ArrayBuffer to string
function arrayBufferToString(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}

// Decrypt a message using Web Crypto API
export const decryptMessage = async (encryptedMessage: string, key: string): Promise<string> => {
  try {
    // Split the encrypted message into parts
    const parts = encryptedMessage.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted message format');
    }

    const ivHex = parts[0];
    const encryptedHex = parts[1];
    const tagHex = parts[2];

    // Convert hex strings to ArrayBuffers
    const iv = hexToArrayBuffer(ivHex);
    const encrypted = hexToArrayBuffer(encryptedHex);
    const tag = hexToArrayBuffer(tagHex);
    const keyBuffer = hexToArrayBuffer(key);

    // Import the key
    const cryptoKey = await crypto.subtle.importKey('raw', keyBuffer, { name: 'AES-GCM' }, false, [
      'decrypt',
    ]);

    // Combine encrypted data and auth tag
    const encryptedData = new Uint8Array(encrypted.byteLength + tag.byteLength);
    encryptedData.set(new Uint8Array(encrypted), 0);
    encryptedData.set(new Uint8Array(tag), encrypted.byteLength);

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(iv),
        additionalData: stringToArrayBuffer('lets-play-chat'),
        tagLength: 128,
      },
      cryptoKey,
      encryptedData
    );

    return arrayBufferToString(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt message');
  }
};

// Generate a conversation key for two users (same as server-side)
export const generateConversationKey = async (
  userId1: string,
  userId2: string
): Promise<string> => {
  // Sort user IDs to ensure consistent key generation
  const sortedIds = [userId1, userId2].sort();
  const combined = sortedIds.join(':');

  // Create a hash of the combined user IDs using SHA-256 (same as server)
  const encoder = new TextEncoder();
  const data = encoder.encode(combined);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  // Return first 64 characters (32 bytes)
  return hashHex.substring(0, 64);
};

// Validate encryption key format
export const isValidEncryptionKey = (key: string): boolean => {
  return /^[a-f0-9]{64}$/.test(key);
};
