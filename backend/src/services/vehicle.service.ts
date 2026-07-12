import type { VehicleStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import { validateVehicleStatusTransition } from "../utils/businessRules.js";

interface CreateVehicleParams {
  registrationNo: string;
  model: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status?: VehicleStatus;
}

interface UpdateVehicleParams {
  registrationNo?: string;
  model?: string;
  type?: string;
  maxLoadCapacity?: number;
  odometer?: number;
  acquisitionCost?: number;
  status?: VehicleStatus;
}

interface VehicleListQuery {
  page: number;
  limit: number;
  status?: VehicleStatus | undefined;
  search?: string | undefined;
}

const vehicleSelect = {
  id: true,
  registrationNo: true,
  model: true,
  type: true,
  maxLoadCapacity: true,
  odometer: true,
  acquisitionCost: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class VehicleService {
  /**
   * Create a new vehicle.
   * Checks for duplicate registrationNo before inserting.
   */
  async create(params: CreateVehicleParams) {
    const existing = await prisma.vehicle.findUnique({
      where: { registrationNo: params.registrationNo },
    });

    if (existing) {
      throw new AppError(
        `A vehicle with registration number "${params.registrationNo}" already exists.`,
        409
      );
    }

    return prisma.vehicle.create({
      data: params,
      select: vehicleSelect,
    });
  }

  /**
   * Retrieve a paginated list of vehicles.
   * Supports optional status filter and search by registrationNo or model.
   */
  async findAll(query: VehicleListQuery) {
    const { page, limit, status, search } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { registrationNo: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
      ];
    }

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        select: vehicleSelect,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.vehicle.count({ where }),
    ]);

    return {
      vehicles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Retrieve a single vehicle by ID.
   */
  async findById(id: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      select: {
        ...vehicleSelect,
        trips: {
          select: { id: true, source: true, destination: true, status: true },
          take: 10,
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            trips: true,
            maintenanceLogs: true,
            fuelLogs: true,
            expenses: true,
          },
        },
      },
    });

    if (!vehicle) {
      throw new AppError("Vehicle not found.", 404);
    }

    return vehicle;
  }

  /**
   * Update an existing vehicle.
   * If registrationNo is being changed, checks it's not already taken.
   */
  async update(id: string, params: UpdateVehicleParams) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });

    if (!vehicle) {
      throw new AppError("Vehicle not found.", 404);
    }

    if (params.status && params.status !== vehicle.status) {
      validateVehicleStatusTransition(vehicle.status, params.status);
    }

    // Check uniqueness only if registrationNo is changing
    if (params.registrationNo && params.registrationNo !== vehicle.registrationNo) {
      const duplicate = await prisma.vehicle.findUnique({
        where: { registrationNo: params.registrationNo },
      });

      if (duplicate) {
        throw new AppError(
          `A vehicle with registration number "${params.registrationNo}" already exists.`,
          409
        );
      }
    }

    return prisma.vehicle.update({
      where: { id },
      data: params,
      select: vehicleSelect,
    });
  }

  /**
   * Delete a vehicle by ID.
   * Prevents deletion of vehicles that are currently ON_TRIP.
   */
  async delete(id: string) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });

    if (!vehicle) {
      throw new AppError("Vehicle not found.", 404);
    }

    if (vehicle.status === "ON_TRIP") {
      throw new AppError(
        "Cannot delete a vehicle that is currently on a trip.",
        400
      );
    }

    await prisma.vehicle.delete({ where: { id } });
  }
}

export const vehicleService = new VehicleService();
