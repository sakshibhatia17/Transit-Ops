import { LayoutDashboard, Truck, Users, Route, Wrench, Fuel, BarChart3, Settings } from "lucide-react";

function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r px-4 py-6 overflow-y-auto">
      <h1 className="text-2xl font-bold text-[#22577A] mb-8">
        TransitOps
      </h1>

      <nav className="space-y-2">
        <SidebarItem icon={<LayoutDashboard size={18} />} text="Dashboard" />
        <SidebarItem icon={<Truck size={18} />} text="Fleet" />
        <SidebarItem icon={<Users size={18} />} text="Drivers" />
        <SidebarItem icon={<Route size={18} />} text="Trips" />
        <SidebarItem icon={<Wrench size={18} />} text="Maintenance" />
        <SidebarItem icon={<Fuel size={18} />} text="Fuel & Expenses" />
        <SidebarItem icon={<BarChart3 size={18} />} text="Analytics" />
        <SidebarItem icon={<Settings size={18} />} text="Settings" />
      </nav>
    </aside>
  );
}

function SidebarItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-[#EAF4F4] hover:text-[#22577A] transition">
      {icon}
      <span>{text}</span>
    </button>
  );
}

export default Sidebar;