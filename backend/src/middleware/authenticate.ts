import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

/**
 * Middleware that extracts and verifies the JWT from the Authorization header.
 * Attaches the decoded payload to `req.user`.
 *
 * Expected header format: `Authorization: Bearer <token>`
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Authentication required. Please provide a valid token.", 401);
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    throw new AppError("Invalid or expired token.", 401);
  }
}
