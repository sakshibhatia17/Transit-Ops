import enum
from sqlalchemy import Column, Integer, String, Float, Enum, Date
from db import Base # Adapts to Sakshi's core configuration

class MaintenanceStatus(str, enum.Enum):
    OPEN = "Open"
    CLOSED = "Closed"

class Maintenance(Base):
    __tablename__ = "maintenance_logs"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, nullable=False)
    description = Column(String, nullable=False)
    cost = Column(Float, default=0.0)
    status = Column(Enum(MaintenanceStatus), default=MaintenanceStatus.OPEN)

class FuelLog(Base):
    __tablename__ = "fuel_logs"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, nullable=False)
    liters = Column(Float, nullable=False)
    cost = Column(Float, nullable=False)
    date = Column(String, nullable=False) # Store string representation or ISO format

class ExpenseLog(Base):
    __tablename__ = "expense_logs"
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False) # e.g., Tolls, Permit, Fine, Driver Food
    description = Column(String, nullable=True)