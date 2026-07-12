import DashboardLayout from "../../layouts/DashboardLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart3, Truck, Route, IndianRupee } from "lucide-react";

const fuelData = [
  { month: "Jan", cost: 42 },
  { month: "Feb", cost: 38 },
  { month: "Mar", cost: 51 },
  { month: "Apr", cost: 46 },
  { month: "May", cost: 58 },
  { month: "Jun", cost: 55 },
];

const tripData = [
  { day: "Mon", trips: 18 },
  { day: "Tue", trips: 24 },
  { day: "Wed", trips: 20 },
  { day: "Thu", trips: 28 },
  { day: "Fri", trips: 32 },
  { day: "Sat", trips: 25 },
];

const statusData = [
  { name: "Available", value: 56 },
  { name: "On Trip", value: 28 },
  { name: "Maintenance", value: 16 },
];

const COLORS = ["#22C55E", "#3B82F6", "#F59E0B"];

function Reports() {
  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Reports & Analytics
          </h1>
          <p className="text-slate-500">
            Fleet insights and operational analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          <Card
            icon={<Truck />}
            title="Fleet Size"
            value="128"
            border="border-blue-500"
          />

          <Card
            icon={<Route />}
            title="Trips"
            value="3,248"
            border="border-green-500"
          />

          <Card
            icon={<IndianRupee />}
            title="Revenue"
            value="₹12.4L"
            border="border-yellow-500"
          />

          <Card
            icon={<BarChart3 />}
            title="Efficiency"
            value="91%"
            border="border-red-500"
          />

        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold mb-4">
              Monthly Fuel Cost
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fuelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  dataKey="cost"
                  stroke="#22577A"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold mb-4">
              Trips Per Day
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tripData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="trips" fill="#22577A" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <h2 className="font-semibold mb-4">
            Vehicle Status
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>

              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {statusData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>
    </DashboardLayout>
  );
}

function Card({
  icon,
  title,
  value,
  border,
}: any) {
  return (
    <div className={`bg-white rounded-xl shadow p-5 border-l-4 ${border}`}>
      <div className="flex justify-between">
        <div className="text-[#22577A]">{icon}</div>
        <span className="text-3xl font-bold">{value}</span>
      </div>

      <p className="mt-3 text-slate-500">
        {title}
      </p>
    </div>
  );
}

export default Reports;