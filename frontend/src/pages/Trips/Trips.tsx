import DashboardLayout from "../../layouts/DashboardLayout";
import TripForm from "../../components/trips/TripForm";
import TripLifecycle from "../../components/trips/TripLifecycle";
import LiveTrips from "../../components/trips/LiveTrips";
import ValidationCard from "../../components/trips/ValidationCard";

function Trips() {
  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Trip Management
          </h1>

          <p className="text-slate-500">
            Create, dispatch and monitor fleet trips.
          </p>
        </div>

        <TripLifecycle />

        <div className="grid grid-cols-3 gap-6">

          <div className="col-span-2">
            <TripForm />
          </div>

          <div>
            <LiveTrips />
          </div>

        </div>

        <ValidationCard />

      </div>
    </DashboardLayout>
  );
}

export default Trips;