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
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="relative w-80">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 outline-none focus:border-[#22577A]"
        />
      </div>

      <div className="flex items-center gap-5">
        <Bell
          className="text-slate-600 cursor-pointer"
          size={20}
        />

        <button
  onClick={toggleTheme}
  className="p-2 rounded-full hover:bg-slate-100 transition"
>
  {theme === "light" ? (
    <Moon size={18} />
  ) : (
    <Sun size={18} />
  )}
</button>

        <div className="flex items-center gap-2">
          <UserCircle2 size={34} className="text-[#22577A]" />
          <span className="font-medium">Admin</span>
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