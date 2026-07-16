import { TripStatus, VehicleStatus, DriverStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { AppError } from '../utils/AppError.js';
import { validateVehicleDispatch, validateDriverAssignment } from '../utils/businessRules.js';

export class StateMachineService {
  /**
   * PHASE 2: Dispatch a Trip with full validation rules
   */
  static async dispatchTrip(tripId: string) {
    return await prisma.$transaction(async (tx) => {
      // 1. Fetch the trip along with its current vehicle and driver
      const trip = await tx.trip.findUnique({
        where: { id: tripId },
        include: { vehicle: true, driver: true },
      });

      if (!trip) throw new AppError('Trip not found', 404);
      if (trip.status !== TripStatus.DRAFT) {
        throw new AppError(`Cannot dispatch trip in '${trip.status}' status. Must be DRAFT.`, 400);
      }

      const { vehicle, driver } = trip;

      // 2. Hackathon Business Validation Checks
      validateVehicleDispatch(vehicle.status);
      validateDriverAssignment(driver.status, driver.licenseExpiry);

      if (trip.cargoWeight > vehicle.maxLoadCapacity) {
        throw new AppError(`Cargo weight (${trip.cargoWeight}kg) exceeds vehicle capacity limit (${vehicle.maxLoadCapacity}kg).`, 400);
      }

      // 3. Atomic State Updates
      await tx.vehicle.update({
        where: { id: vehicle.id },
        data: { status: VehicleStatus.ON_TRIP },
      });

      await tx.driver.update({
        where: { id: driver.id },
        data: { status: DriverStatus.ON_TRIP },
      });

      return await tx.trip.update({
        where: { id: tripId },
        data: { status: TripStatus.DISPATCHED },
      });
    });
  }

  /**
   * PHASE 3: Complete Trip (Updates odometer, adds fuel, releases resources)
   */
  static async completeTrip(tripId: string, finalOdometer: number, fuelConsumed: number) {
    return await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({ where: { id: tripId } });
      if (!trip || trip.status !== TripStatus.DISPATCHED) {
        throw new AppError('Trip must be in DISPATCHED status to complete.', 400);
      }

      // Release resources back to pool
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { 
          status: VehicleStatus.AVAILABLE,
          odometer: finalOdometer 
        },
      });

      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: DriverStatus.AVAILABLE },
      });

      return await tx.trip.update({
        where: { id: tripId },
        data: {
          status: TripStatus.COMPLETED,
          fuelConsumed: fuelConsumed,
        },
      });
    });
  }

  /**
   * PHASE 4: Cancel Trip
   */
  static async cancelTrip(tripId: string) {
    return await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({ where: { id: tripId } });
      if (!trip || trip.status === TripStatus.COMPLETED || trip.status === TripStatus.CANCELLED) {
        throw new AppError('Cannot cancel a completed or already cancelled trip.', 400);
      }

      // Reset vehicle and driver back to available if they were dispatched
      if (trip.status === TripStatus.DISPATCHED) {
        await tx.vehicle.update({
          where: { id: trip.vehicleId },
          data: { status: VehicleStatus.AVAILABLE },
        });
        await tx.driver.update({
          where: { id: trip.driverId },
          data: { status: DriverStatus.AVAILABLE },
        });
      }

      return await tx.trip.update({
        where: { id: tripId },
        data: { status: TripStatus.CANCELLED },
      });
    });
  }

  /**
   * PHASE 5: Start & Close Maintenance Log
   */
  static async startMaintenance(vehicleId: string, type: string, anticipatedCost: number) {
    return await prisma.$transaction(async (tx) => {
      await tx.vehicle.update({
        where: { id: vehicleId },
        data: { status: VehicleStatus.IN_SHOP },
      });

      return await tx.maintenanceLog.create({
        data: {
          vehicleId,
          type,
          cost: anticipatedCost,
          startDate: new Date(),
          isActive: true,
        },
      });
    });
  }

  static async closeMaintenance(logId: string, finalCost: number) {
    return await prisma.$transaction(async (tx) => {
      const log = await tx.maintenanceLog.findUnique({ where: { id: logId } });
      if (!log) throw new AppError('Maintenance entry not found', 404);

      await tx.vehicle.update({
        where: { id: log.vehicleId },
        data: { status: VehicleStatus.AVAILABLE },
      });

      return await tx.maintenanceLog.update({
        where: { id: logId },
        data: {
          cost: finalCost,
          endDate: new Date(),
          isActive: false,
        },
      });
    });
  }
}