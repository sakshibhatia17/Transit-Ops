import { prisma } from "../lib/prisma.js";

export class DashboardService {
  async getStats() {
    const [
      totalVehicles,
      availableVehicles,
      vehiclesOnTrip,
      vehiclesInMaintenance,
      totalDrivers,
      availableDrivers,
      driversOnTrip,
      totalTrips,
      activeTrips,
      completedTrips,
      fuelCostResult,
      maintenanceCostResult,
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: "AVAILABLE" } }),
      prisma.vehicle.count({ where: { status: "ON_TRIP" } }),
      prisma.vehicle.count({ where: { status: "IN_SHOP" } }),
      prisma.driver.count(),
      prisma.driver.count({ where: { status: "AVAILABLE" } }),
      prisma.driver.count({ where: { status: "ON_TRIP" } }),
      prisma.trip.count(),
      prisma.trip.count({ where: { status: "DISPATCHED" } }),
      prisma.trip.count({ where: { status: "COMPLETED" } }),
      prisma.fuelLog.aggregate({ _sum: { cost: true } }),
      prisma.maintenanceLog.aggregate({ _sum: { cost: true } }),
    ]);

    return {
      totalVehicles,
      availableVehicles,
      vehiclesOnTrip,
      vehiclesInMaintenance,
      totalDrivers,
      availableDrivers,
      driversOnTrip,
      totalTrips,
      activeTrips,
      completedTrips,
      totalFuelCost: fuelCostResult._sum.cost || 0,
      totalMaintenanceCost: maintenanceCostResult._sum.cost || 0,
    };
  }
}

export const dashboardService = new DashboardService();
