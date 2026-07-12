import StatusBadge from "./StatusBadge";

const trips = [
  {
    id: "TR001",
    vehicle: "Truck-12",
    driver: "Rahul Sharma",
    status: "On Trip",
  },
  {
    id: "TR002",
    vehicle: "Van-08",
    driver: "Amit Kumar",
    status: "Dispatched",
  },
  {
    id: "TR003",
    vehicle: "Mini-04",
    driver: "Priya Singh",
    status: "Completed",
  },
];

function LiveTrips() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-5">
        Live Trips
      </h2>

      <div className="space-y-4">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="border rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold">{trip.id}</h3>
              <p className="text-sm text-slate-500">
                {trip.vehicle}
              </p>
              <p className="text-sm text-slate-500">
                {trip.driver}
              </p>
            </div>

            <StatusBadge status={trip.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveTrips;