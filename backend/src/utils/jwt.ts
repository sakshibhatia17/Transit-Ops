import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";
import { env } from "../config/env.js";

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}

/**
 * Sign a JWT with the user's id, email, and role.
 */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(
    { ...payload },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
  );
}

/**
 * Verify and decode a JWT. Returns the decoded payload or throws.
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
