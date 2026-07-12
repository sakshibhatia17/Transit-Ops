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
    
    @staticmethod
    def complete_trip(trip: dict, final_odometer: float, fuel_consumed: float) -> dict:
        """
        Transitions a trip from Dispatched to Completed. 
        Releases the vehicle and driver back to Available.
        """
        if trip["status"] != TripStatus.DISPATCHED:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot complete a trip that is currently '{trip['status']}'. Must be Dispatched."
            )
            
        # Complete the business cycle
        trip["status"] = TripStatus.COMPLETED
        trip["final_odometer"] = final_odometer
        trip["fuel_consumed"] = fuel_consumed
        
        # Real-world status reset (mocked states)
        # vehicle["status"] = "Available"
        # driver["status"] = "Available"
        return trip

    @staticmethod
    def cancel_trip(trip: dict) -> dict:
        """
        Transitions a active or draft trip to Cancelled.
        Releases associated resources immediately.
        """
        if trip["status"] in [TripStatus.COMPLETED, TripStatus.CANCELLED]:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot cancel a trip that is already {trip['status']}."
            )
            
        trip["status"] = TripStatus.CANCELLED
        # Real-world status reset (mocked states)
        # vehicle["status"] = "Available"
        # driver["status"] = "Available"
        return trip
    
    @staticmethod
    def start_maintenance(maintenance_record: dict) -> dict:
        """
        Transitions a vehicle status from Available to In Shop.
        """
        # vehicle = mock_get_vehicle(maintenance_record["vehicle_id"])
        # if vehicle["status"] != "Available":
        #     raise HTTPException(status_code=400, detail="Vehicle must be Available to enter maintenance.")
        
        maintenance_record["status"] = "Open"
        # vehicle["status"] = "In Shop"
        return maintenance_record

    @staticmethod
    def close_maintenance(maintenance_record: dict, final_cost: float) -> dict:
        """
        Closes maintenance ticket and restores vehicle back to Available status.
        """
        if maintenance_record["status"] != "Open":
            raise HTTPException(status_code=400, detail="Maintenance ticket is already closed.")
            
        maintenance_record["status"] = "Closed"
        maintenance_record["cost"] = final_cost
        # vehicle["status"] = "Available"
        return maintenance_record