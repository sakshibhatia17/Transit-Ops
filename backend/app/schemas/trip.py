from pydantic import BaseModel
from typing import Optional
from app.models.trip import TripStatus

class TripBase(BaseModel):
    source: str
    destination: str
    vehicle_id: int
    driver_id: int
    cargo_weight: float
    planned_distance: float

class TripCreate(TripBase):
    pass

class TripUpdate(BaseModel):
    source: Optional[str] = None
    destination: Optional[str] = None
    vehicle_id: Optional[int] = None
    driver_id: Optional[int] = None
    cargo_weight: Optional[float] = None
    planned_distance: Optional[float] = None
    status: Optional[TripStatus] = None

class TripResponse(TripBase):
    id: int
    status: TripStatus

    class Config:
        from_attributes = True