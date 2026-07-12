import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

/**
 * Global error handler middleware.
 * Must be registered LAST in the middleware chain (after all routes).
 *
 * - Operational errors (AppError): Sends the error message and status code.
 * - Unexpected errors: Logs the stack trace and sends a generic 500.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Prisma unique-constraint violation (P2002)
  if (
    err &&
    typeof err === "object" &&
    "code" in err &&
    (err as { code: string }).code === "P2002"
  ) {
    res.status(409).json({
      success: false,
      message: "A record with this value already exists.",
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Unexpected / programmer error
  console.error("🔥 Unexpected error:", err);

  res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === "production"
        ? "An unexpected error occurred."
        : err.message,
  });
}
