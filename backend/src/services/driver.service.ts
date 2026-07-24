import type { DriverStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import {
  validateDriverStatusTransition,
  validateDriverLicense,
} from "../utils/businessRules.js";

interface CreateDriverParams {
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  contactNumber: string;
  safetyScore?: number;
  status?: DriverStatus;
}

interface UpdateDriverParams {
  name?: string;
  licenseNumber?: string;
  licenseCategory?: string;
  licenseExpiry?: string;
  contactNumber?: string;
  safetyScore?: number;
  status?: DriverStatus;
}

interface DriverListQuery {
  page: number;
  limit: number;
  status?: DriverStatus | undefined;
  search?: string | undefined;
}

const driverSelect = {
  id: true,
  name: true,
  licenseNumber: true,
  licenseCategory: true,
  licenseExpiry: true,
  contactNumber: true,
  safetyScore: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class DriverService {
  /**
   * Create a new driver.
   * Checks for duplicate licenseNumber before inserting.
   */
  async create(params: CreateDriverParams) {
    const existing = await prisma.driver.findUnique({
      where: { licenseNumber: params.licenseNumber },
    });

    validateDriverLicense(params.licenseExpiry);

    if (existing) {
      throw new AppError(
        `A driver with license number "${params.licenseNumber}" already exists.`,
        409,
      );
    }

    return prisma.driver.create({
      data: params,
      select: driverSelect,
    });
  }

  /**
   * Retrieve a paginated list of drivers.
   * Supports optional status filter and search by name or licenseNumber.
   */
  async findAll(query: DriverListQuery) {
    const { page, limit, status, search } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { licenseNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    const [drivers, total] = await Promise.all([
      prisma.driver.findMany({
        where,
        select: driverSelect,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.driver.count({ where }),
    ]);

    return {
      drivers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Retrieve a single driver by ID.
   */
  async findById(id: string) {
    const driver = await prisma.driver.findUnique({
      where: { id },
      select: {
        ...driverSelect,
        trips: {
          select: { id: true, source: true, destination: true, status: true },
          take: 10,
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { trips: true },
        },
      },
    });

    if (!driver) {
      throw new AppError("Driver not found.", 404);
    }

    return driver;
  }

  /**
   * Update an existing driver.
   * Enforces rules for suspended drivers and uniqueness on license changes.
   */
  async update(id: string, params: UpdateDriverParams) {
    const driver = await prisma.driver.findUnique({ where: { id } });

    if (!driver) {
      throw new AppError("Driver not found.", 404);
    }

    if (params.status && params.status !== driver.status) {
      validateDriverStatusTransition(driver.status, params.status);
    }

    if (params.licenseExpiry) {
      validateDriverLicense(params.licenseExpiry);
    }

    // Check uniqueness only if licenseNumber is changing
    if (params.licenseNumber && params.licenseNumber !== driver.licenseNumber) {
      const duplicate = await prisma.driver.findUnique({
        where: { licenseNumber: params.licenseNumber },
      });

      if (duplicate) {
        throw new AppError(
          `A driver with license number "${params.licenseNumber}" already exists.`,
          409,
        );
      }
    }

    return prisma.driver.update({
      where: { id },
      data: params,
      select: driverSelect,
    });
  }

  /**
   * Delete a driver by ID.
   */
  async delete(id: string) {
    const driver = await prisma.driver.findUnique({ where: { id } });

    if (!driver) {
      throw new AppError("Driver not found.", 404);
    }

    if (driver.status === "ON_TRIP") {
      throw new AppError(
        "Cannot delete a driver that is currently on a trip.",
        400,
      );
    }

    const trips = await prisma.trip.count({
      where: {
        driverId: id,
      },
    });

    if (trips > 0) {
      throw new AppError("Cannot delete a driver who has trip history.", 400);
    }
    await prisma.driver.delete({ where: { id } });
  }
}

export const driverService = new DriverService();
