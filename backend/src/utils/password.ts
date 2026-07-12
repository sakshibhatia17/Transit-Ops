import bcrypt from "bcrypt";
import { env } from "../config/env.js";

/**
 * Hash a plain-text password using bcrypt.
 */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, env.BCRYPT_SALT_ROUNDS);
}

/**
 * Compare a plain-text password against a bcrypt hash.
 */
export async function comparePassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}
