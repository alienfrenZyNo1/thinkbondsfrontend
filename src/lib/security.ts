import crypto from 'crypto';

/**
 * Generate a secure random token
 * @param length Length of the token in bytes (default: 32)
 * @returns A secure random token as a hexadecimal string
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a time-limited token
 * @param data Data to include in the token
 * @param expiresIn Time in seconds until the token expires (default: 1 day)
 * @returns A JWT-like token with expiration
 */
export function generateTimeLimitedToken(data: any, expiresIn: number = 86400): string {
  const payload = {
    data,
    exp: Math.floor(Date.now() / 1000) + expiresIn,
    iat: Math.floor(Date.now() / 1000)
  };
  
  // In a real implementation, this would be a proper JWT
  // For now, we'll use a simple approach
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

/**
 * Verify a time-limited token
 * @param token The token to verify
 * @returns The decoded data if valid, null if invalid or expired
 */
export function verifyTimeLimitedToken(token: string): any | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    
    // Check if token has expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Token expired
    }
    
    return payload.data;
  } catch (error) {
    return null; // Invalid token
  }
}

/**
 * Generate a 6-digit OTP
 * @returns A 6-digit numeric OTP as a string
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Hash a value using SHA-256
 * @param value The value to hash
 * @returns The hashed value as a hexadecimal string
 */
export function hashValue(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}