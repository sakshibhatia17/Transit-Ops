import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 px-4 py-6 overflow-y-auto transition-colors">
      <h1 className="text-2xl font-bold text-[#22577A] dark:text-[#98D9C4] mb-8">
        TransitOps
      </h1>

      <nav className="space-y-2">
        <SidebarItem
          icon={<LayoutDashboard size={18} />}
          text="Dashboard"
          to="/dashboard"
        />

        <SidebarItem
          icon={<Truck size={18} />}
          text="Vehicles"
          to="/vehicles"
        />

        <SidebarItem
          icon={<Users size={18} />}
          text="Drivers"
          to="/drivers"
        />

        <SidebarItem
          icon={<Route size={18} />}
          text="Trips"
          to="/trips"
        />

        <SidebarItem
          icon={<Wrench size={18} />}
          text="Maintenance"
          to="/maintenance"
        />

        <SidebarItem
          icon={<Fuel size={18} />}
          text="Fuel & Expenses"
          to="/fuel-expenses"
        />

        <SidebarItem
          icon={<BarChart3 size={18} />}
          text="Analytics"
          to="/reports"
        />

        <SidebarItem
          icon={<Settings size={18} />}
          text="Settings"
          to="/settings"
        />
      </nav>
    </aside>
  );
}

type SidebarItemProps = {
  icon: React.ReactNode;
  text: string;
  to: string;
};

function SidebarItem({ icon, text, to }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
  `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
    isActive
      ? "bg-[#22577A] text-white"
      : "text-slate-700 dark:text-slate-300 hover:bg-[#EAF4F4] dark:hover:bg-slate-800 hover:text-[#22577A] dark:hover:text-[#98D9C4]"
  }`
}
    >
      {icon}
      <span>{text}</span>
    </NavLink>
  );
}

export default Sidebar;