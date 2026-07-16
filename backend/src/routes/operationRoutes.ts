import express from 'express';
import type { Request, Response } from 'express';
import { prisma } from "../lib/prisma.js";
import { StateMachineService } from '../services/stateMachine.js'; // Note the .js extension!

const router = express.Router();

// Create Maintenance Log
router.post('/maintenance', async (req: Request, res: Response) => {
  try {
    const { vehicleId, type, cost } = req.body;
    const log = await StateMachineService.startMaintenance(vehicleId, type, Number(cost || 0));
    res.status(201).json(log);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Close Maintenance Ticket
router.patch('/maintenance/:id/close', async (req: Request, res: Response) => {
  try {
    const { finalCost } = req.body;
    // Explicitly cast req.params.id to a string string
    const closedLog = await StateMachineService.closeMaintenance(String(req.params.id), Number(finalCost));
    res.json(closedLog);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Log Fuel Entry
router.post('/fuel', async (req: Request, res: Response) => {
  try {
    const { vehicleId, liters, cost, date } = req.body;
    const fuelLog = await prisma.fuelLog.create({
      data: { vehicleId, liters: Number(liters), cost: Number(cost), date: new Date(date) }
    });
    res.status(201).json(fuelLog);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Log Expense Entry
router.post('/expense', async (req: Request, res: Response) => {
  try {
    const { vehicleId, category, amount, date } = req.body;
    const expense = await prisma.expense.create({
      data: { vehicleId, category, amount: Number(amount), date: new Date(date || Date.now()) }
    });
    res.status(201).json(expense);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;