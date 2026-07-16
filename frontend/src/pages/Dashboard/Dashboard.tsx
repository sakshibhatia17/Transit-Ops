import DashboardLayout from "../../layouts/DashboardLayout";
import KpiCard from "../../components/dashboard/KpiCard";
import { useEffect, useState } from "react";
import { getDashboardData } from "../../api/dashboard";

function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentTrips, setRecentTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardData();

        console.log("Dashboard Data:", data);

        setStats(data.stats);

        setRecentTrips(data.recentTrips);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Heading */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Monitor your fleet operations in real time.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <select className="border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors">
            <option>Vehicle Type</option>
          </select>

          <select className="border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors">
            <option>Status</option>
          </select>

          <select className="border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors">
            <option>Region</option>
          </select>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-4 gap-5">
          <KpiCard
            title="Active Vehicles"
            value={loading ? "..." : String(stats?.vehiclesOnTrip ?? 0)}
            borderColor="border-blue-500"
          />

          <KpiCard
            title="Available Vehicles"
            value={loading ? "..." : String(stats?.availableVehicles ?? 0)}
            borderColor="border-green-500"
          />

          <KpiCard
            title="Active Trips"
            value={loading ? "..." : String(stats?.activeTrips ?? 0)}
            borderColor="border-yellow-500"
          />

          <KpiCard
            title="Drivers On Duty"
            value={loading ? "..." : String(stats?.driversOnTrip ?? 0)}
            borderColor="border-cyan-500"
          />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-3 gap-6">
          {/* Recent Trips */}
          <div className="col-span-2 bg-white dark:bg-slate-900 rounded-xl shadow transition-colors p-5">
            <h2 className="text-xl font-semibold mb-4">Recent Trips</h2>

            <table className="w-full">
              <thead className="text-slate-500 dark:text-slate-400 text-sm">
                <tr>
                  <th className="text-left py-2">Trip</th>
                  <th className="text-left">Vehicle</th>
                  <th className="text-left">Driver</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">ETA</th>
                </tr>
              </thead>

              <tbody>
                {recentTrips.map((trip: any) => (
                  <tr
                    key={trip.id}
                    className="border-t border-slate-200 dark:border-slate-700"
                  >
                    <td className="py-3">{trip.id.slice(0, 8)}</td>

                    <td>{trip.vehicle?.registrationNo ?? "-"}</td>

                    <td>{trip.driver?.name ?? "-"}</td>

                    <td>{trip.status}</td>

                    <td>{trip.destination ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vehicle Status */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow transition-colors p-5">
            <h2 className="text-xl font-semibold mb-5">Vehicle Status</h2>

            {[
              {
                label: "Available",
                count: stats?.availableVehicles ?? 0,
                percent: stats?.totalVehicles
                  ? (stats.availableVehicles / stats.totalVehicles) * 100
                  : 0,
              },
              {
                label: "On Trip",
                count: stats?.vehiclesOnTrip ?? 0,
                percent: stats?.totalVehicles
                  ? (stats.vehiclesOnTrip / stats.totalVehicles) * 100
                  : 0,
              },
              {
                label: "In Shop",
                count: stats?.vehiclesInMaintenance ?? 0,
                percent: stats?.totalVehicles
                  ? (stats.vehiclesInMaintenance / stats.totalVehicles) * 100
                  : 0,
              },
            ].map(({ label, count, percent }) => (
              <div key={label} className="mb-5">
                <div className="flex justify-between mb-1">
                  <span>{label}</span>
                  <span>
  {count} ({percent.toFixed(0)}%)
</span>
                </div>

                <div className="h-2 bg-slate-200 rounded-full">
                  <div
                    className="h-2 rounded-full bg-[#22577A]"
                    style={{ width: `${percent}%` }}
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
