import * as argon2 from 'argon2';
import { scryptSync, timingSafeEqual } from 'node:crypto';

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    if (stored.startsWith('$argon2')) {
      return await argon2.verify(stored, password);
    }

    // Fallback for previous scrypt salt:hash format
    const [salt, key] = stored.split(':');
    if (salt && key) {
      const keyBuffer = Buffer.from(key, 'hex');
      const derivedBuffer = scryptSync(password, salt, 64);
      return timingSafeEqual(keyBuffer, derivedBuffer);
    }

    return false;
  } catch {
    return false;
  }
}
