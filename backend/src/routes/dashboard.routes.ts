import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get(
  "/stats",
  authenticate,
  authorize("ADMIN", "FLEET_MANAGER", "FINANCIAL_ANALYST"),
  dashboardController.getStats
);

export default router;
