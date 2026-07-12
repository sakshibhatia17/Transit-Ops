import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator.js";

const router = Router();

/**
 * POST /api/auth/register
 * Public — registers a new user.
 */
router.post(
  "/register",
  validate(registerSchema),
  (req, res, next) => authController.register(req, res, next)
);

/**
 * POST /api/auth/login
 * Public — authenticates an existing user.
 */
router.post(
  "/login",
  validate(loginSchema),
  (req, res, next) => authController.login(req, res, next)
);

/**
 * GET /api/auth/me
 * Protected — returns the authenticated user's profile.
 */
router.get(
  "/me",
  authenticate,
  (req, res, next) => authController.me(req, res, next)
);

export default router;
