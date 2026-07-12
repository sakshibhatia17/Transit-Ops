import { Router } from "express";
import { vehicleController } from "../controllers/vehicle.controller.js";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import {
  createVehicleSchema,
  updateVehicleSchema,
} from "../validators/vehicle.validator.js";

const router = Router();

// All vehicle routes require authentication
router.use(authenticate);

/**
 * POST /api/vehicles
 * Create a new vehicle.
 * Allowed: ADMIN, FLEET_MANAGER
 */
router.post(
  "/",
  authorize("ADMIN", "FLEET_MANAGER"),
  validate(createVehicleSchema),
  (req, res, next) => vehicleController.create(req, res, next)
);

/**
 * GET /api/vehicles
 * List all vehicles (paginated, filterable).
 * Allowed: All authenticated users.
 */
router.get(
  "/",
  (req, res, next) => vehicleController.findAll(req, res, next)
);

/**
 * GET /api/vehicles/:id
 * Get a single vehicle by ID.
 * Allowed: All authenticated users.
 */
router.get(
  "/:id",
  (req, res, next) => vehicleController.findById(req, res, next)
);

/**
 * PUT /api/vehicles/:id
 * Update a vehicle.
 * Allowed: ADMIN, FLEET_MANAGER
 */
router.put(
  "/:id",
  authorize("ADMIN", "FLEET_MANAGER"),
  validate(updateVehicleSchema),
  (req, res, next) => vehicleController.update(req, res, next)
);

/**
 * DELETE /api/vehicles/:id
 * Delete a vehicle.
 * Allowed: ADMIN only.
 */
router.delete(
  "/:id",
  authorize("ADMIN"),
  (req, res, next) => vehicleController.delete(req, res, next)
);

export default router;
