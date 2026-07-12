import { z } from "zod/v4";

const driverStatusEnum = z.enum(["AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED"]);

export const createDriverSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  licenseNumber: z
    .string()
    .min(1, "License number is required")
    .max(50, "License number must not exceed 50 characters")
    .trim(),
  licenseCategory: z
    .string()
    .min(1, "License category is required")
    .max(20, "License category must not exceed 20 characters")
    .trim(),
  licenseExpiry: z
    .string()
    .datetime()
    .refine((val) => new Date(val) > new Date(), {
      message: "License expiry cannot be in the past",
    }),
  contactNumber: z
    .string()
    .min(1, "Contact number is required")
    .max(20, "Contact number must not exceed 20 characters")
    .trim(),
  safetyScore: z
    .number()
    .min(0, "Safety score cannot be less than 0")
    .max(100, "Safety score cannot be greater than 100")
    .optional(),
  status: driverStatusEnum.optional(),
});

export const updateDriverSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters")
    .trim()
    .optional(),
  licenseNumber: z
    .string()
    .min(1, "License number is required")
    .max(50, "License number must not exceed 50 characters")
    .trim()
    .optional(),
  licenseCategory: z
    .string()
    .min(1, "License category is required")
    .max(20, "License category must not exceed 20 characters")
    .trim()
    .optional(),
  licenseExpiry: z
    .string()
    .datetime()
    .refine((val) => new Date(val) > new Date(), {
      message: "License expiry cannot be in the past",
    })
    .optional(),
  contactNumber: z
    .string()
    .min(1, "Contact number is required")
    .max(20, "Contact number must not exceed 20 characters")
    .trim()
    .optional(),
  safetyScore: z
    .number()
    .min(0, "Safety score cannot be less than 0")
    .max(100, "Safety score cannot be greater than 100")
    .optional(),
  status: driverStatusEnum.optional(),
});

export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;
