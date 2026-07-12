import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Users,
  UserCheck,
  Route,
  UserX,
} from "lucide-react";

const drivers = [
  {
    name: "Alex Johnson",
    license: "DL04AB1234",
    phone: "+91 9876543210",
    experience: "5 Years",
    status: "Available",
  },
  {
    name: "Rahul Sharma",
    license: "DL04CD5678",
    phone: "+91 9123456789",
    experience: "3 Years",
    status: "On Trip",
  },
  {
    name: "Priya Singh",
    license: "DL04EF9012",
    phone: "+91 9988776655",
    experience: "2 Years",
    status: "Off Duty",
  },
];

function badge(status: string) {
  switch (status) {
    case "Available":
      return "bg-green-100 text-green-700";
    case "On Trip":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

function Drivers() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Driver Management</h1>
            <p className="text-slate-500">
              Manage drivers and monitor their availability.
            </p>
          </div>

          <button className="flex items-center gap-2 bg-[#22577A] text-white px-5 py-2 rounded-lg hover:bg-[#1A4761]">
            <Plus size={18} />
            Add Driver
          </button>
        </div>

        {/* Fleet Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {[
  {
    title: "Total Drivers",
    value: "56",
    icon: Users,
  },
  {
    title: "Available",
    value: "38",
    icon: UserCheck,
  },
  {
    title: "On Trip",
    value: "12",
    icon: Route,
  },
  {
    title: "Off Duty",
    value: "6",
    icon: UserX,
  },
].map(({ title, value, icon: Icon }, index) => (
            <div
              key={title}
              className={`bg-white rounded-xl shadow p-5 border-l-4 ${
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

              <p className="mt-3 text-slate-500">{title}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow p-4 flex gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              placeholder="Search driver..."
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
        <div className="bg-white rounded-xl shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-4">Driver</th>
                  <th className="text-left">Licence No.</th>
                  <th className="text-left">Phone</th>
                  <th className="text-left">Experience</th>
                  <th className="text-left">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {drivers.map((driver) => (
                  <tr
                    key={driver.license}
                    className="border-t hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4">{driver.name}</td>
                    <td>{driver.license}</td>
                    <td>{driver.phone}</td>
                    <td>{driver.experience}</td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${badge(driver.status)}`}
                      >
                        {driver.status}
                      </span>
                    </td>

                    <td>
                      <div className="flex justify-center items-center gap-3">
                        <button className="p-2 rounded-full hover:bg-slate-100 transition">
                          <Eye size={18} className="text-slate-500" />
                        </button>

                        <button className="p-2 rounded-full hover:bg-slate-100 transition">
                          <Pencil size={18} className="text-slate-500" />
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

          <div className="flex justify-between items-center border-t p-4">
            <p className="text-sm text-slate-500">Showing 1–3 of 3 drivers</p>

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

export default Drivers;
