import express from 'express';
import type { Request, Response } from 'express';
import { TripStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

// Get real-time aggregated metrics for Bhavya's frontend graphs
router.get('/summary', async (_req: Request, res: Response) => {
  try {
    // 1. Calculate operational cost sums
    const fuelCostSum = await prisma.fuelLog.aggregate({ _sum: { cost: true } });
    const maintenanceCostSum = await prisma.maintenanceLog.aggregate({ _sum: { cost: true } });
    const expenseCostSum = await prisma.expense.aggregate({ _sum: { amount: true } });

    const fuelSpend = fuelCostSum._sum.cost || 0;
    const maintenanceSpend = maintenanceCostSum._sum.cost || 0;
    const miscSpend = expenseCostSum._sum.amount || 0;
    const totalOperationalCost = fuelSpend + maintenanceSpend + miscSpend;

    // 2. Count distinct trip statuses
    const draftCount = await prisma.trip.count({ where: { status: TripStatus.DRAFT } });
    const dispatchedCount = await prisma.trip.count({ where: { status: TripStatus.DISPATCHED } });
    const completedCount = await prisma.trip.count({ where: { status: TripStatus.COMPLETED } });
    const cancelledCount = await prisma.trip.count({ where: { status: TripStatus.CANCELLED } });

    res.json({
      metrics: {
        totalOperationalCost,
        fuelSpend,
        maintenanceSpend,
        miscSpend
      },
      tripStatusBreakdown: {
        Draft: draftCount,
        Dispatched: dispatchedCount,
        Completed: completedCount,
        Cancelled: cancelledCount
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Compile and download live data records directly as a spreadsheet
router.get('/export/trips-csv', async (_req: Request, res: Response) => {
  try {
    const trips = await prisma.trip.findMany();

    // Construct the CSV content block
    let csvContent = 'Trip ID,Source,Destination,Cargo Weight (kg),Planned Distance (km),Status\n';
    
    trips.forEach((trip) => {
      csvContent += `"${trip.id}","${trip.source}","${trip.destination}",${trip.cargoWeight},${trip.plannedDistance},"${trip.status}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=fleet_trips_report.csv');
    res.status(200).send(csvContent);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;