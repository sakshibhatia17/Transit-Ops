import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Wrench,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

const maintenanceLogs = [
  {
    vehicle: "Truck-12",
    service: "Engine Oil Change",
    date: "15 Jul 2026",
    cost: "₹4,500",
    status: "Completed",
  },
  {
    vehicle: "Van-05",
    service: "Brake Inspection",
    date: "18 Jul 2026",
    cost: "₹2,200",
    status: "Scheduled",
  },
  {
    vehicle: "Mini-08",
    service: "Tyre Replacement",
    date: "20 Jul 2026",
    cost: "₹9,800",
    status: "Pending",
  },
];

function badge(status: string) {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700";
    case "Scheduled":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

function Maintenance() {
  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Maintenance Management
            </h1>
            <p className="text-slate-500">
              Track vehicle servicing and maintenance history.
            </p>
          </div>

          <button className="flex items-center gap-2 bg-[#22577A] text-white px-5 py-2 rounded-lg hover:bg-[#1A4761]">
            <Plus size={18} />
            Schedule Service
          </button>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          {[
            {
              title: "Total Jobs",
              value: "48",
              icon: Wrench,
              border: "border-blue-500",
            },
            {
              title: "Completed",
              value: "34",
              icon: CheckCircle,
              border: "border-green-500",
            },
            {
              title: "Scheduled",
              value: "10",
              icon: Clock,
              border: "border-yellow-500",
            },
            {
              title: "Pending",
              value: "4",
              icon: AlertTriangle,
              border: "border-red-500",
            },
          ].map(({ title, value, icon: Icon, border }) => (
            <div
              key={title}
              className={`bg-white rounded-xl shadow p-5 border-l-4 ${border}`}
            >
              <div className="flex justify-between">
                <Icon className="text-[#22577A]" />
                <span className="text-3xl font-bold">{value}</span>
              </div>

              <p className="mt-3 text-slate-500">{title}</p>
            </div>
          ))}

        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow p-4 flex gap-4">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />

            <input
              placeholder="Search service..."
              className="w-full border rounded-lg h-12 pl-10 pr-3"
            />
          </div>

          <select className="border rounded-lg px-4 h-12">
            <option>Status</option>
          </select>

          <select className="border rounded-lg px-4 h-12">
            <option>Vehicle</option>
          </select>

        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-4">Vehicle</th>
                  <th className="text-left">Service</th>
                  <th className="text-left">Date</th>
                  <th className="text-left">Cost</th>
                  <th className="text-left">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>

                {maintenanceLogs.map((log) => (
                  <tr
                    key={`${log.vehicle}-${log.date}`}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="p-4">{log.vehicle}</td>
                    <td>{log.service}</td>
                    <td>{log.date}</td>
                    <td>{log.cost}</td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${badge(
                          log.status
                        )}`}
                      >
                        {log.status}
                      </span>
                    </td>

                    <td>
                      <div className="flex justify-center gap-2">

                        <button className="p-2 rounded-full hover:bg-slate-100">
                          <Eye size={18} />
                        </button>

                        <button className="p-2 rounded-full hover:bg-slate-100">
                          <Pencil size={18} />
                        </button>

                        <button className="p-2 rounded-full text-red-500 hover:bg-red-50">
                          <Trash2 size={18} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          <div className="flex justify-between items-center border-t p-4">
            <p className="text-sm text-slate-500">
              Showing 1–3 of 3 maintenance records
            </p>

            <div className="flex gap-2">
              <button className="border rounded-lg px-4 py-2">
                Previous
              </button>

              <button className="border rounded-lg px-4 py-2">
                Next
              </button>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default Maintenance;