import DashboardLayout from "../../layouts/DashboardLayout";
import KpiCard from "../../components/dashboard/KpiCard";

function Dashboard() {
  const trips = [
    { id: "TR001", vehicle: "VAN-05", driver: "Alex", status: "On Trip", eta: "45 min" },
    { id: "TR002", vehicle: "TRK-12", driver: "John", status: "Completed", eta: "-" },
    { id: "TR003", vehicle: "MINI-08", driver: "Priya", status: "Dispatched", eta: "1h 10m" },
    { id: "TR004", vehicle: "-", driver: "-", status: "Draft", eta: "Awaiting Vehicle" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Heading */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500">
            Monitor your fleet operations in real time.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <select className="border rounded-lg px-4 py-2 bg-white">
            <option>Vehicle Type</option>
          </select>

          <select className="border rounded-lg px-4 py-2 bg-white">
            <option>Status</option>
          </select>

          <select className="border rounded-lg px-4 py-2 bg-white">
            <option>Region</option>
          </select>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-4 gap-5">
          <KpiCard title="Active Vehicles" value="53" borderColor="border-blue-500" />
          <KpiCard title="Available Vehicles" value="42" borderColor="border-green-500" />
          <KpiCard title="Active Trips" value="18" borderColor="border-yellow-500" />
          <KpiCard title="Drivers On Duty" value="26" borderColor="border-cyan-500" />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-3 gap-6">

          {/* Recent Trips */}
          <div className="col-span-2 bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-4">
              Recent Trips
            </h2>

            <table className="w-full">
              <thead className="text-slate-500 text-sm">
                <tr>
                  <th className="text-left py-2">Trip</th>
                  <th className="text-left">Vehicle</th>
                  <th className="text-left">Driver</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">ETA</th>
                </tr>
              </thead>

              <tbody>
                {trips.map((trip) => (
                  <tr key={trip.id} className="border-t">
                    <td className="py-3">{trip.id}</td>
                    <td>{trip.vehicle}</td>
                    <td>{trip.driver}</td>
                    <td>{trip.status}</td>
                    <td>{trip.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vehicle Status */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-5">
              Vehicle Status
            </h2>

            {[
              ["Available", "70%"],
              ["On Trip", "35%"],
              ["In Shop", "15%"],
              ["Retired", "5%"],
            ].map(([label, width]) => (
              <div key={label} className="mb-5">
                <div className="flex justify-between mb-1">
                  <span>{label}</span>
                  <span>{width}</span>
                </div>

                <div className="h-2 bg-slate-200 rounded-full">
                  <div
                    className="h-2 rounded-full bg-[#22577A]"
                    style={{ width }}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default Dashboard;