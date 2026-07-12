import { Router } from "express";
import { driverController } from "../controllers/driver.controller.js";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import {
  createDriverSchema,
  updateDriverSchema,
} from "../validators/driver.validator.js";

const router = Router();

// All driver routes require authentication
router.use(authenticate);

/**
 * POST /api/drivers
 * Allowed: ADMIN, SAFETY_OFFICER
 */
router.post(
  "/",
  authorize("ADMIN", "SAFETY_OFFICER"),
  validate(createDriverSchema),
  (req, res, next) => driverController.create(req, res, next)
);

/**
 * GET /api/drivers
 * Allowed: All authenticated users
 */
router.get(
  "/",
  (req, res, next) => driverController.findAll(req, res, next)
);

/**
 * GET /api/drivers/:id
 * Allowed: All authenticated users
 */
router.get(
  "/:id",
  (req, res, next) => driverController.findById(req, res, next)
);

/**
 * PUT /api/drivers/:id
 * Allowed: ADMIN, SAFETY_OFFICER
 */
router.put(
  "/:id",
  authorize("ADMIN", "SAFETY_OFFICER"),
  validate(updateDriverSchema),
  (req, res, next) => driverController.update(req, res, next)
);

/**
 * DELETE /api/drivers/:id
 * Allowed: ADMIN
 */
router.delete(
  "/:id",
  authorize("ADMIN"),
  (req, res, next) => driverController.delete(req, res, next)
);

export default router;
