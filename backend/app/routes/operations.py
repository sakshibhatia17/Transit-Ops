from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from app.services.state_machine import StateMachineService

router = APIRouter(tags=["Operations (Maintenance, Fuel, Expenses)"])

# Mock DB structures for Hackathon speed
MOCK_MAINTENANCE_DB = []
MOCK_FUEL_DB = []
MOCK_EXPENSE_DB = []

# Simple Pydantic Body Schemas
class MaintenanceCreate(BaseModel):
    vehicle_id: int
    description: str

class FuelCreate(BaseModel):
    vehicle_id: int
    liters: float
    cost: float
    date: str

class ExpenseCreate(BaseModel):
    amount: float
    category: str
    description: str = None

# --- PHASE 5: MAINTENANCE ENDPOINTS ---
@router.post("/maintenance")
def create_maintenance(data: MaintenanceCreate):
    record = {
        "id": len(MOCK_MAINTENANCE_DB) + 1,
        **data.model_dump()
    }
    updated_record = StateMachineService.start_maintenance(record)
    MOCK_MAINTENANCE_DB.append(updated_record)
    return updated_record

@router.get("/maintenance")
def get_all_maintenance():
    return MOCK_MAINTENANCE_DB

@router.patch("/maintenance/{id}/close")
def close_maintenance(id: int, cost: float):
    record = next((m for m in MOCK_MAINTENANCE_DB if m["id"] == id), None)
    if not record:
        raise HTTPException(status_code=404, detail="Maintenance record not found")
    return StateMachineService.close_maintenance(record, cost)

# --- PHASE 6: FUEL LOGS ENDPOINTS ---
@router.post("/fuel")
def log_fuel(data: FuelCreate):
    log = {"id": len(MOCK_FUEL_DB) + 1, **data.model_dump()}
    MOCK_FUEL_DB.append(log)
    return log

@router.get("/fuel")
def get_fuel_logs():
    return MOCK_FUEL_DB

# --- PHASE 7: EXPENSE LOGS ENDPOINTS ---
@router.post("/expense")
def log_expense(data: ExpenseCreate):
    expense = {"id": len(MOCK_EXPENSE_DB) + 1, **data.model_dump()}
    MOCK_EXPENSE_DB.append(expense)
    return expense

@router.get("/expense")
def get_expense_logs():
    return MOCK_EXPENSE_DB