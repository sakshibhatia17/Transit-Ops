import express from 'express';
import type { Request, Response } from 'express';
import { prisma } from "../lib/prisma.js";
import { StateMachineService } from '../services/stateMachine.js';

const router = express.Router();

// Create Trip (Draft)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { source, destination, cargoWeight, plannedDistance, vehicleId, driverId } = req.body;
    const newTrip = await prisma.trip.create({
      data: { source, destination, cargoWeight, plannedDistance, vehicleId, driverId }
    });
    res.status(201).json(newTrip);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Trips
router.get('/', async (_req: Request, res: Response) => {
  try {
    const trips = await prisma.trip.findMany({ include: { vehicle: true, driver: true } });
    res.json(trips);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Dispatch Trip
router.post('/:id/dispatch', async (req: Request, res: Response) => {
  try {
    const updatedTrip = await StateMachineService.dispatchTrip(req.params.id as string);
    res.json(updatedTrip);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Complete Trip
router.post('/:id/complete', async (req: Request, res: Response) => {
  try {
    const { finalOdometer, fuelConsumed } = req.body;
    const completedTrip = await StateMachineService.completeTrip(req.params.id as string, Number(finalOdometer), Number(fuelConsumed));
    res.json(completedTrip);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Cancel Trip
router.post('/:id/cancel', async (req: Request, res: Response) => {
  try {
    const cancelledTrip = await StateMachineService.cancelTrip(req.params.id as string);
    res.json(cancelledTrip);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;