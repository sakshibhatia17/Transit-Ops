import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Fuel,
  IndianRupee,
  Gauge,
  Wallet,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const fuelLogs = [
  {
    vehicle: "Truck-12",
    date: "12 Jul 2026",
    fuel: "65 L",
    cost: "₹6,200",
    mileage: "4.8 km/L",
    expense: "Fuel",
    status: "Approved",
  },
  {
    vehicle: "Van-05",
    date: "11 Jul 2026",
    fuel: "42 L",
    cost: "₹3,980",
    mileage: "8.1 km/L",
    expense: "Toll",
    status: "Pending",
  },
  {
    vehicle: "Mini-08",
    date: "10 Jul 2026",
    fuel: "28 L",
    cost: "₹2,650",
    mileage: "9.3 km/L",
    expense: "Maintenance",
    status: "Approved",
  },
];

function badge(status: string) {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-red-100 text-red-700";
  }
}

function FuelExpenses() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Fuel & Expense Management</h1>

            <p className="text-slate-500 dark:text-slate-400">
              Track operational fuel usage and expenses.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-[#22577A] text-white px-5 py-2 rounded-lg hover:bg-[#1A4761]">
              <Plus size={18} />
              Log Fuel
            </button>

            <button className="flex items-center gap-2 border border-[#22577A] text-[#22577A] px-5 py-2 rounded-lg hover:bg-slate-100">
              <Plus size={18} />
              Add Expense
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {[
            {
              title: "Fuel Cost",
              value: "₹2.45L",
              icon: Fuel,
              border: "border-blue-500",
            },
            {
              title: "Expenses",
              value: "₹78K",
              icon: IndianRupee,
              border: "border-green-500",
            },
            {
              title: "Avg Mileage",
              value: "7.8 km/L",
              icon: Gauge,
              border: "border-yellow-500",
            },
            {
              title: "Operational Cost",
              value: "₹3.23L",
              icon: Wallet,
              border: "border-red-500",
            },
          ].map(({ title, value, icon: Icon, border }) => (
            <div
              key={title}
              className={`bg-white dark:bg-slate-900 rounded-xl shadow transition-colors p-5 border-l-4 ${border}`}
            >
              <div className="flex justify-between items-center">
                <Icon className="text-[#22577A]" />
                <span className="text-2xl font-bold">{value}</span>
              </div>

              <p className="mt-3 text-slate-500 dark:text-slate-400">{title}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow transition-colors p-4 flex gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />

            <input
              placeholder="Search fuel log..."
              className="w-full border rounded-lg h-12 pl-10 pr-3"
            />
          </div>

          <select className="border rounded-lg px-4 h-12">
            <option>Vehicle</option>
          </select>

          <select className="border rounded-lg px-4 h-12">
            <option>Month</option>
          </select>

          <select className="border rounded-lg px-4 h-12">
            <option>Expense Type</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow transition-colors">

  <div className="overflow-x-auto">

    <table className="w-full">

      <thead className="bg-slate-50 dark:bg-slate-800">
        <tr>
          <th className="text-left p-4">Vehicle</th>
          <th className="text-left">Date</th>
          <th className="text-left">Fuel</th>
          <th className="text-left">Cost</th>
          <th className="text-left">Mileage</th>
          <th className="text-left">Expense</th>
          <th className="text-left">Status</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>

      <tbody>

        {fuelLogs.map((log) => (

          <tr
            key={`${log.vehicle}-${log.date}`}
            className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 transition-colors"
          >
            <td className="p-4">{log.vehicle}</td>
            <td>{log.date}</td>
            <td>{log.fuel}</td>
            <td>{log.cost}</td>
            <td>{log.mileage}</td>
            <td>{log.expense}</td>

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
              <div className="flex justify-center items-center gap-3">

                <button className="p-2 rounded-full hover:bg-slate-100 transition">
                  <Eye size={18} className="text-slate-500 dark:text-slate-400" />
                </button>

                <button className="p-2 rounded-full hover:bg-slate-100 transition">
                  <Pencil size={18} className="text-slate-500 dark:text-slate-400" />
                </button>

                <button className="p-2 rounded-full text-red-500 hover:bg-red-50 transition">
                  <Trash2 size={18} />
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
      Showing 1–3 of 3 fuel logs
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
    </DashboardLayout>
  );
}

export default FuelExpenses;
