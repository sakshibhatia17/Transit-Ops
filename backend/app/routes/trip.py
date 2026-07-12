from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.trip import TripCreate, TripUpdate, TripResponse

router = APIRouter(prefix="/trips", tags=["Trips"])

# Temporary in-memory list mimicking DB storage for the first commit
MOCK_TRIPS_DB = []

@ प्रांत.post("/", response_model=TripResponse)
def create_trip(trip: TripCreate):
    new_trip = {
        "id": len(MOCK_TRIPS_DB) + 1,
        "status": "Draft",
        **trip.model_dump()
    }
    MOCK_TRIPS_DB.append(new_trip)
    return new_trip

@router.get("/", response_model=List[TripResponse])
def get_all_trips():
    return MOCK_TRIPS_DB

@router.get("/{id}", response_model=TripResponse)
def get_trip(id: int):
    trip = next((t for t in MOCK_TRIPS_DB if t["id"] == id), None)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@router.put("/{id}", response_model=TripResponse)
def update_trip(id: int, updated_fields: TripUpdate):
    trip = next((t for t in MOCK_TRIPS_DB if t["id"] == id), None)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    for key, val in updated_fields.model_dump(exclude_unset=True).items():
        trip[key] = val
    return trip

@router.delete("/{id}")
def delete_trip(id: int):
    global MOCK_TRIPS_DB
    trip = next((t for t in MOCK_TRIPS_DB if t["id"] == id), None)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    MOCK_TRIPS_DB = [t for t in MOCK_TRIPS_DB if t["id"] != id]
    return {"message": f"Trip {id} successfully deleted"}