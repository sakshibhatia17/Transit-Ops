from fastapi import HTTPException
from app.models.trip import TripStatus

# Simulating data lookups since other modules are in progress
def mock_get_vehicle(vehicle_id: int):
    # Mocking a valid, active vehicle. Change to return None or specific statuses to test failures.
    return {"id": vehicle_id, "status": "Available", "capacity": 10000, "retired": False}

def mock_get_driver(driver_id: int):
    # Mocking a valid driver with an unexpired license
    return {"id": driver_id, "status": "Available", "license_valid": True}


class StateMachineService:
    @staticmethod
    def dispatch_trip(trip: dict) -> dict:
        """
        Executes the business rules to transition a trip from Draft to Dispatched.
        Updates vehicle and driver statuses inline.
        """
        # 1. Check current trip state
        if trip["status"] != TripStatus.DRAFT:
            raise HTTPException(
                status_code=400, 
                detail=f"Cannot dispatch trip in '{trip['status']}' status. Must be Draft."
            )

        # 2. Fetch vehicle and driver metadata
        vehicle = mock_get_vehicle(trip["vehicle_id"])
        driver = mock_get_driver(trip["driver_id"])

        # 3. Apply Hackathon Business Rules
        if not vehicle or vehicle["retired"]:
            raise HTTPException(status_code=400, detail="Vehicle is retired or does not exist.")
        
        if vehicle["status"] == "In Shop":
            raise HTTPException(status_code=400, detail="Vehicle is currently in maintenance.")
        
        if vehicle["status"] != "Available":
            raise HTTPException(status_code=400, detail="Vehicle is already assigned to another trip.")

        if not driver or not driver["license_valid"]:
            raise HTTPException(status_code=400, detail="Driver does not have a valid license.")

        if driver["status"] != "Available":
            raise HTTPException(status_code=400, detail="Driver is already assigned to another trip.")

        if trip["cargo_weight"] > vehicle["capacity"]:
            raise HTTPException(
                status_code=400, 
                detail=f"Cargo weight ({trip['cargo_weight']}kg) exceeds vehicle capacity ({vehicle['capacity']}kg)."
            )

        # 4. Atomic State Changes if all validations pass
        trip["status"] = TripStatus.DISPATCHED
        vehicle["status"] = "On Trip"
        driver["status"] = "On Trip"

        return trip