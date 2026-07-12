import {
  Bell,
  Search,
  UserCircle2,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 sticky top-0 z-50 transition-colors">
      <div className="relative w-80">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-2 pl-10 pr-4 outline-none focus:border-[#22577A] transition-colors"
        />
      </div>

      <div className="flex items-center gap-5">
        <Bell
  className="text-slate-600 dark:text-slate-300 cursor-pointer"
  size={20}
/>

        <button
  onClick={toggleTheme}
  className="p-2 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
>
  {theme === "light" ? (
  <Moon size={18} className="text-slate-700" />
) : (
  <Sun size={18} className="text-yellow-400" />
)}
</button>

        <div className="flex items-center gap-2">
          <UserCircle2 size={34} className="text-[#22577A]" />
          <span className="font-medium text-slate-800 dark:text-white">
  Admin
</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-600 transition"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;