from sqlalchemy import Column, Integer, String, Float, Enum
from db import Base  # Adjust import based on Sakshi's actual base configuration
import enum

class TripStatus(str, enum.Enum):
    DRAFT = "Draft"
    DISPATCHED = "Dispatched"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    cargo_weight = Column(Float, nullable=False)
    planned_distance = Column(Float, nullable=False)
    status = Column(Enum(TripStatus), default=TripStatus.DRAFT, nullable=False)

    # Placeholders for Sakshi's upcoming models
    vehicle_id = Column(Integer, nullable=False)  # Will become ForeignKey("vehicles.id")
    driver_id = Column(Integer, nullable=False)   # Will become ForeignKey("drivers.id")