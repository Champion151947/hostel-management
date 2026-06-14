import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Bug, CalendarClock, Wallet, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "Students", icon: Users },
  { to: "/complaints", label: "Complaint", icon: Bug },
  { to: "/leave-requests", label: "Leave Request", icon: CalendarClock },
  { to: "/fee-management", label: "Fee Management", icon: Wallet },
];

export default function Sidebar() {
  const { admin, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1e2433] border-r border-[#2a3142] flex flex-col z-40">
      <div className="p-5 border-b border-[#2a3142]">
        <h1 className="text-xl font-bold text-blue-400">Staysync</h1>
        <p className="text-sm text-[#94a3b8] mt-1">{admin?.name}</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive ? "bg-blue-600 text-white" : "text-[#94a3b8] hover:bg-[#2a3142] hover:text-white"}`
            }>
            <Icon size={20} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-[#2a3142]">
        <button onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#94a3b8] hover:bg-red-600 hover:text-white transition w-full">
          <LogOut size={20} /><span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
