import csv
from io import StringIO
from fastapi import APIRouter, Response
from app.routes.trip import MOCK_TRIPS_DB
from app.routes.operations import MOCK_MAINTENANCE_DB, MOCK_FUEL_DB, MOCK_EXPENSE_DB

router = APIRouter(prefix="/analytics", tags=["Dashboard & Analytics"])

@router.get("/summary")
def get_dashboard_summary():
    """
    Aggregates metrics from your entire module to feed Bhavya's frontend charts.
    """
    total_distance = sum(t.get("planned_distance", 0) for t in MOCK_TRIPS_DB if t.get("status") == "Completed")
    total_fuel_cost = sum(f.get("cost", 0) for f in MOCK_FUEL_DB)
    total_maintenance_cost = sum(m.get("cost", 0) for m in MOCK_MAINTENANCE_DB)
    total_other_expenses = sum(e.get("amount", 0) for e in MOCK_EXPENSE_DB)
    
    total_operational_cost = total_fuel_cost + total_maintenance_cost + total_other_expenses

    return {
        "metrics": {
            "total_distance_km": total_distance,
            "total_operational_cost_inr": total_operational_cost,
            "fuel_spend": total_fuel_cost,
            "maintenance_spend": total_maintenance_cost,
            "misc_spend": total_other_expenses
        },
        "trip_status_breakdown": {
            "Draft": len([t for t in MOCK_TRIPS_DB if t.get("status") == "Draft"]),
            "Dispatched": len([t for t in MOCK_TRIPS_DB if t.get("status") == "Dispatched"]),
            "Completed": len([t for t in MOCK_TRIPS_DB if t.get("status") == "Completed"]),
            "Cancelled": len([t for t in MOCK_TRIPS_DB if t.get("status") == "Cancelled"]),
        }
    }

@router.get("/export/trips-csv")
def export_trips_to_csv():
    """
    Generates and downloads a clean comma-separated report of all fleet operations.
    """
    stream = StringIO()
    writer = csv.writer(stream)
    
    # Header row
    writer.writerow(["Trip ID", "Source", "Destination", "Cargo Weight (kg)", "Distance (km)", "Status"])
    
    # Write rows dynamically from memory database
    for trip in MOCK_TRIPS_DB:
        writer.writerow([
            trip.get("id"),
            trip.get("source"),
            trip.get("destination"),
            trip.get("cargo_weight"),
            trip.get("planned_distance"),
            trip.get("status")
        ])
        
    response = Response(stream.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=fleet_trips_report.csv"
    return response