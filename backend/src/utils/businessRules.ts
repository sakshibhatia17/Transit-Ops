import { VehicleStatus, DriverStatus } from "@prisma/client";
import { AppError } from "./AppError.js";

/**
 * Validates if a vehicle transition is allowed.
 */
export function validateVehicleStatusTransition(
  currentStatus: VehicleStatus,
  nextStatus: VehicleStatus,
): void {
  if (currentStatus === nextStatus) return;

  const validTransitions: Record<VehicleStatus, VehicleStatus[]> = {
    AVAILABLE: ["ON_TRIP", "IN_SHOP", "RETIRED"],
    ON_TRIP: ["AVAILABLE"],
    IN_SHOP: ["AVAILABLE", "RETIRED"],
    RETIRED: [],
  };

  if (!validTransitions[currentStatus]?.includes(nextStatus)) {
    throw new AppError(
      `Invalid vehicle status transition from ${currentStatus} to ${nextStatus}.`,
      400,
    );
  }
}

/**
 * Validates if a driver transition is allowed.
 */
export function validateDriverStatusTransition(
  currentStatus: DriverStatus,
  nextStatus: DriverStatus,
): void {
  if (currentStatus === nextStatus) return;

  const validTransitions: Record<DriverStatus, DriverStatus[]> = {
    AVAILABLE: ["ON_TRIP", "SUSPENDED"],
    ON_TRIP: ["AVAILABLE"],
    SUSPENDED: [],
    OFF_DUTY: [],
  };

  if (!validTransitions[currentStatus]?.includes(nextStatus)) {
    throw new AppError(
      `Invalid driver status transition from ${currentStatus} to ${nextStatus}.`,
      400,
    );
  }
}

/**
 * Validates if a driver's license is valid (not expired).
 */
export function validateDriverLicense(expiryDate: Date | string): void {
  if (new Date(expiryDate) < new Date()) {
    throw new AppError("Driver license has expired.", 400);
  }
}

/**
 * Validates if a vehicle can be dispatched.
 */
export function validateVehicleDispatch(status: VehicleStatus): void {
  if (status === "ON_TRIP" || status === "IN_SHOP" || status === "RETIRED") {
    throw new AppError(
      `Vehicle cannot be dispatched while in ${status} status.`,
      400,
    );
  }
}

/**
 * Validates if a driver can be assigned to a trip.
 */
export function validateDriverAssignment(
  status: DriverStatus,
  expiryDate: Date | string,
): void {
  if (status === "ON_TRIP" || status === "SUSPENDED") {
    throw new AppError(
      `Driver cannot be assigned while in ${status} status.`,
      400,
    );
  }
  validateDriverLicense(expiryDate);
}
