import { z } from "zod/v4";

const vehicleStatusEnum = z.enum(["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"]);

export const createVehicleSchema = z.object({
  registrationNo: z
    .string()
    .min(1, "Registration number is required")
    .max(50, "Registration number must not exceed 50 characters")
    .trim(),
  model: z
    .string()
    .min(1, "Model is required")
    .max(100, "Model must not exceed 100 characters")
    .trim(),
  type: z
    .string()
    .min(1, "Type is required")
    .max(50, "Type must not exceed 50 characters")
    .trim(),
  maxLoadCapacity: z
    .number()
    .positive("Max load capacity must be a positive number"),
  odometer: z
    .number()
    .nonnegative("Odometer reading cannot be negative"),
  acquisitionCost: z
    .number()
    .positive("Acquisition cost must be a positive number"),
  status: vehicleStatusEnum.optional(),
});

export const updateVehicleSchema = z.object({
  registrationNo: z
    .string()
    .min(1, "Registration number is required")
    .max(50, "Registration number must not exceed 50 characters")
    .trim()
    .optional(),
  model: z
    .string()
    .min(1, "Model is required")
    .max(100, "Model must not exceed 100 characters")
    .trim()
    .optional(),
  type: z
    .string()
    .min(1, "Type is required")
    .max(50, "Type must not exceed 50 characters")
    .trim()
    .optional(),
  maxLoadCapacity: z
    .number()
    .positive("Max load capacity must be a positive number")
    .optional(),
  odometer: z
    .number()
    .nonnegative("Odometer reading cannot be negative")
    .optional(),
  acquisitionCost: z
    .number()
    .positive("Acquisition cost must be a positive number")
    .optional(),
  status: vehicleStatusEnum.optional(),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
