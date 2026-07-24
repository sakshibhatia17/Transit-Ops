import { Search, Plus } from "lucide-react";

interface DriverOption {
  id: string;
  name: string;
}

interface VehicleOption {
  id: string;
  registrationNo: string;
}

interface TripFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;

  statusFilter: string;
  setStatusFilter: (value: string) => void;

  driverFilter: string;
  setDriverFilter: (value: string) => void;

  vehicleFilter: string;
  setVehicleFilter: (value: string) => void;

  drivers: DriverOption[];
  vehicles: VehicleOption[];

  onAddTrip: () => void;
}

function TripFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  driverFilter,
  setDriverFilter,
  vehicleFilter,
  setVehicleFilter,
  drivers,
  vehicles,
  onAddTrip,
}: TripFiltersProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}

        <div className="relative w-full lg:max-w-sm">
          <Search
            className="absolute left-3 top-3 text-slate-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search trips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border py-2 pl-10 pr-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters */}

        <div className="flex flex-wrap gap-3">

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            value={driverFilter}
            onChange={(e) => setDriverFilter(e.target.value)}
            className="rounded-lg border px-3 py-2"
          >
            <option value="">All Drivers</option>

            {drivers.map((driver) => (
              <option
                key={driver.id}
                value={driver.id}
              >
                {driver.name}
              </option>
            ))}
          </select>

          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="rounded-lg border px-3 py-2"
          >
            <option value="">All Vehicles</option>

            {vehicles.map((vehicle) => (
              <option
                key={vehicle.id}
                value={vehicle.id}
              >
                {vehicle.registrationNo}
              </option>
            ))}
          </select>

          <button
            onClick={onAddTrip}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Trip
          </button>

        </div>
      </div>
    </div>
  );
}

export default TripFilters;