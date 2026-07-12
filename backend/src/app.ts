import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import driverRoutes from "./routes/driver.routes.js";

// Import your newly migrated Fleet Operations & Logistics modules
import tripRoutes from "./routes/tripRoutes.js";
import operationRoutes from "./routes/operationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

const app = express();

// ─── Security ───────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// ─── Body Parsing ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ─── Logging ────────────────────────────────────────────────────────────────────
if (env.NODE_ENV !== "test") {
  app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
}

// ─── Health Check ───────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "TransitOps API is running.",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ─────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);

// Register your functional workflow gateways
app.use("/api/trips", tripRoutes);
app.use("/api/operations", operationRoutes);
app.use("/api/analytics", analyticsRoutes);

// ─── 404 Handler ────────────────────────────────────────────────────────────────
app.all("{*path}", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ─── Global Error Handler (must be last) ────────────────────────────────────────
app.use(errorHandler);

export default app;