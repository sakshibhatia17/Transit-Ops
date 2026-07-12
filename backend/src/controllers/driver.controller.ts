import type { Request, Response, NextFunction } from "express";
import type { DriverStatus } from "@prisma/client";
import { driverService } from "../services/driver.service.js";

/**
 * Driver Controller — thin HTTP layer delegating to DriverService.
 */
export class DriverController {
  /**
   * POST /api/drivers
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const driver = await driverService.create(req.body);

      res.status(201).json({
        success: true,
        message: "Driver created successfully.",
        data: { driver },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/drivers
   */
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
      const status = req.query.status as DriverStatus | undefined;
      const search = req.query.search as string | undefined;

      const result = await driverService.findAll({ page, limit, status, search });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/drivers/:id
   */
  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const driver = await driverService.findById(req.params.id as string);

      res.status(200).json({
        success: true,
        data: { driver },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/drivers/:id
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const driver = await driverService.update(req.params.id as string, req.body);

      res.status(200).json({
        success: true,
        message: "Driver updated successfully.",
        data: { driver },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/drivers/:id
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await driverService.delete(req.params.id as string);

      res.status(200).json({
        success: true,
        message: "Driver deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const driverController = new DriverController();
