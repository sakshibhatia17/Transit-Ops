import { useMemo, useState } from "react";

import TripStats from "../../components/trips/TripStats";
import TripFilters from "../../components/trips/TripFilters";
import TripTable from "../../components/trips/TripTable";
import TripFormModal, {
  type TripFormData,
} from "../../components/trips/TripFormModal";
import ViewTripModal from "../../components/trips/ViewTripModal";
import DeleteTripModal from "../../components/trips/DeleteTripModal";

import type { Trip } from "../../components/trips/types";

function Trips() {
  // Backend data
  const [trips] = useState<Trip[]>([]);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [driverFilter, setDriverFilter] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");

  // Selected trip
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Form mode
  const [mode, setMode] = useState<"add" | "edit">("add");

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Loading
  const [loading] = useState(false);

  // Filter trips
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch =
        trip.source.toLowerCase().includes(search.toLowerCase()) ||
        trip.destination.toLowerCase().includes(search.toLowerCase()) ||
        trip.driver.name.toLowerCase().includes(search.toLowerCase()) ||
        trip.vehicle.registrationNo
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus = !statusFilter || trip.status === statusFilter;

      const matchesDriver = !driverFilter || trip.driver.id === driverFilter;

      const matchesVehicle =
        !vehicleFilter || trip.vehicle.id === vehicleFilter;

      return matchesSearch && matchesStatus && matchesDriver && matchesVehicle;
    });
  }, [trips, search, statusFilter, driverFilter, vehicleFilter]);

  // Add Trip
  const handleAdd = () => {
    setMode("add");
    setSelectedTrip(null);
    setFormOpen(true);
  };

  // Edit Trip
  const handleEdit = (trip: Trip) => {
    setMode("edit");
    setSelectedTrip(trip);
    setFormOpen(true);
  };

  // View Trip
  const handleView = (trip: Trip) => {
    setSelectedTrip(trip);
    setViewOpen(true);
  };

  // Delete Trip
  const handleDelete = (trip: Trip) => {
    setSelectedTrip(trip);
    setDeleteOpen(true);
  };

  // Form Submit
  const handleSubmit = (data: TripFormData) => {
    console.log(data);

    // TODO:
    // POST / PUT backend

    setFormOpen(false);
  };

  // Confirm Delete
  const confirmDelete = (trip: Trip) => {
    console.log(trip);

    // TODO:
    // DELETE backend

    setDeleteOpen(false);
  };

  // Lifecycle actions
  const dispatchTrip = (trip: Trip) => {
    console.log("Dispatch", trip);
  };

  const completeTrip = (trip: Trip) => {
    console.log("Complete", trip);
  };

  const cancelTrip = (trip: Trip) => {
    console.log("Cancel", trip);
  };
  return (
    <div className="space-y-6 p-6">
      <TripStats trips={trips} />

      <TripFilters
        searchTerm={search}
        setSearchTerm={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        driverFilter={driverFilter}
        setDriverFilter={setDriverFilter}
        vehicleFilter={vehicleFilter}
        setVehicleFilter={setVehicleFilter}
        drivers={[
          ...new Map(
            trips.map((trip) => [
              trip.driver.id,
              {
                id: trip.driver.id,
                name: trip.driver.name,
              },
            ]),
          ).values(),
        ]}
        vehicles={[
          ...new Map(
            trips.map((trip) => [
              trip.vehicle.id,
              {
                id: trip.vehicle.id,
                registrationNo: trip.vehicle.registrationNo,
              },
            ]),
          ).values(),
        ]}
        onAddTrip={handleAdd}
      />

      <TripTable
        trips={filteredTrips}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <TripFormModal
        open={formOpen}
        mode={mode}
        trip={selectedTrip}
        drivers={[
          ...new Map(
            trips.map((trip) => [
              trip.driver.id,
              {
                id: trip.driver.id,
                name: trip.driver.name,
              },
            ]),
          ).values(),
        ]}
        vehicles={[
          ...new Map(
            trips.map((trip) => [
              trip.vehicle.id,
              {
                id: trip.vehicle.id,
                registrationNo: trip.vehicle.registrationNo,
              },
            ]),
          ).values(),
        ]}
        loading={loading}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ViewTripModal
        open={viewOpen}
        trip={selectedTrip}
        onClose={() => setViewOpen(false)}
        onDispatch={dispatchTrip}
        onComplete={completeTrip}
        onCancel={cancelTrip}
      />

      <DeleteTripModal
        open={deleteOpen}
        trip={selectedTrip}
        loading={loading}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default Trips;
