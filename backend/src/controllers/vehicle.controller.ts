import type { Request, Response, NextFunction } from "express";
import type { VehicleStatus } from "@prisma/client";
import { vehicleService } from "../services/vehicle.service.js";

/**
 * Vehicle Controller — thin HTTP layer delegating to VehicleService.
 */
export class VehicleController {
  /**
   * POST /api/vehicles
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await vehicleService.create(req.body);

      res.status(201).json({
        success: true,
        message: "Vehicle created successfully.",
        data: { vehicle },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/vehicles
   */
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
      const status = req.query.status as VehicleStatus | undefined;
      const search = req.query.search as string | undefined;

      const result = await vehicleService.findAll({ page, limit, status, search });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/vehicles/:id
   */
  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await vehicleService.findById(req.params.id as string);

      res.status(200).json({
        success: true,
        data: { vehicle },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/vehicles/:id
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await vehicleService.update(req.params.id as string, req.body);

      res.status(200).json({
        success: true,
        message: "Vehicle updated successfully.",
        data: { vehicle },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/vehicles/:id
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await vehicleService.delete(req.params.id as string);

      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const vehicleController = new VehicleController();
