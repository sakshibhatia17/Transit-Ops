import type { Request, Response, NextFunction } from "express";
import type { Role } from "@prisma/client";
import { AppError } from "../utils/AppError.js";

/**
 * Middleware factory that restricts access to users with specific roles.
 * Must be used AFTER the `authenticate` middleware so that `req.user` is populated.
 *
 * @example
 * router.get("/admin-only", authenticate, authorize("ADMIN"), handler);
 * router.get("/multi-role", authenticate, authorize("ADMIN", "FLEET_MANAGER"), handler);
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError("Authentication required.", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        "You do not have permission to perform this action.",
        403
      );
    }

    next();
  };
}
