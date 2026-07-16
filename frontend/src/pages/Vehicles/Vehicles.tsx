import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Truck,
  CheckCircle,
  Route,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Vehicle } from "../../types/vehicle";
import { getVehicles } from "../../api/vehicles";


function badge(status: string) {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-100 text-green-700";

    case "ON_TRIP":
      return "bg-blue-100 text-blue-700";

    case "IN_SHOP":
      return "bg-yellow-100 text-yellow-700";

    case "RETIRED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const totalFleet = vehicles.length;

  const availableVehicles = vehicles.filter(
    (v) => v.status === "AVAILABLE",
  ).length;

  const onTripVehicles = vehicles.filter((v) => v.status === "ON_TRIP").length;

  const inShopVehicles = vehicles.filter((v) => v.status === "IN_SHOP").length;

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();

        console.log("Vehicles:", data);

        setVehicles(data);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Vehicle Management</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Monitor and manage your fleet.
            </p>
          </div>

          <button className="flex items-center gap-2 bg-[#22577A] text-white px-5 py-2 rounded-lg hover:bg-[#1A4761]">
            <Plus size={18} />
            Add Vehicle
          </button>
        </div>

        {/* Fleet Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {[
            {
              title: "Total Fleet",
              value: totalFleet,
              icon: Truck,
            },
            {
              title: "Available",
              value: availableVehicles,
              icon: CheckCircle,
            },
            {
              title: "On Trip",
              value: onTripVehicles,
              icon: Route,
            },
            {
              title: "In Shop",
              value: inShopVehicles,
              icon: Wrench,
            },
          ].map(({ title, value, icon: Icon }, index) => (
            <div
              key={title}
              className={`bg-white dark:bg-slate-900 rounded-xl shadow transition-colors p-5 border-l-4 ${
                index === 0
                  ? "border-blue-500"
                  : index === 1
                    ? "border-green-500"
                    : index === 2
                      ? "border-yellow-500"
                      : "border-red-500"
              }`}
            >
              <div className="flex justify-between items-center">
                <Icon className="text-[#22577A]" />
                <span className="text-3xl font-bold">{value}</span>
              </div>

              <p className="mt-3 text-slate-500 dark:text-slate-400">{title}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow transition-colors p-4 flex gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              placeholder="Search vehicle..."
              className="w-full border rounded-lg h-12 pl-10 pr-3"
            />
          </div>

          <select className="border rounded-lg px-4 h-12">
            <option>Status</option>
          </select>

          <select className="border rounded-lg px-4 h-12">
            <option>Type</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="text-left p-4">Registration</th>
                  <th className="text-left">Vehicle</th>
                  <th className="text-left">Type</th>
                  <th className="text-left">Capacity</th>
                  <th className="text-left">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {vehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 transition-colors"
                  >
                    <td className="p-4">{vehicle.registrationNo}</td>
                    <td>{vehicle.model}</td>
                    <td>{vehicle.type}</td>
                    <td>{vehicle.maxLoadCapacity} kg</td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${badge(
                          vehicle.status,
                        )}`}
                      >
                        {vehicle.status}
                      </span>
                    </td>

                    <td>
                      <div className="flex justify-center items-center gap-3">
                        <button className="p-2 rounded-full hover:bg-slate-100 transition">
                          <Eye
                            size={18}
                            className="text-slate-500 dark:text-slate-400"
                          />
                        </button>

                        <button className="p-2 rounded-full hover:bg-slate-100 transition">
                          <Pencil
                            size={18}
                            className="text-slate-500 dark:text-slate-400"
                          />
                        </button>

                        <button className="p-2 rounded-full text-red-500 hover:bg-red-50 transition focus:outline-none">
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
  Showing {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""}
</p>

            <div className="flex gap-2">
              <button className="border rounded-lg px-4 py-2 hover:bg-slate-100">
                Previous
              </button>

              <button className="border rounded-lg px-4 py-2 hover:bg-slate-100">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Vehicles;
