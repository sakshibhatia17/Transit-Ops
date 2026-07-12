import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod/v4";
import { z } from "zod/v4";

/**
 * Express middleware factory that validates `req.body` against the given Zod schema.
 * On failure, responds with 400 and a structured error list.
 * On success, replaces `req.body` with the parsed (and transformed) data.
 */
export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = z.prettifyError(result.error);

      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
      return;
    }

    req.body = result.data;
    next();
  };
}
