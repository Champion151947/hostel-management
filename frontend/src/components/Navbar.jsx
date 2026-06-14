import { useTheme } from "../context/ThemeContext.jsx";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { dark, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-[#1e293b]">Hostel Management System</h2>
      <button onClick={toggleTheme} className="p-2 rounded-lg bg-[#f1f5f9] hover:bg-[#e2e8f0] transition text-[#64748b]">
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
}
