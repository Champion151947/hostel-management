import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ArrowLeft } from "lucide-react";

export default function AddStudent() {
  const { authAxios } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", address: "", dateOfBirth: "", gender: "Male",
    course: "", year: "", roomNumber: "", parentName: "", parentPhone: "", status: "Active",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    authAxios.get("/rooms").then(({ data }) => setRooms(data)).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try { await authAxios.post("/students", form); navigate("/students"); }
    catch (err) { setError(err.response?.data?.message || "Failed to add student"); }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/students")} className="p-2 hover:bg-[#f1f5f9] rounded-lg text-[#64748b]"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold text-[#1e293b]">Add Student</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-xl border border-[#e2e8f0] p-6 space-y-4 shadow-sm">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>}
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Full Name *</label><input name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
          <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Email *</label><input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
          <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Password *</label><input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Set login password" /></div>
          <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Phone *</label><input name="phone" value={form.phone} onChange={handleChange} required className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
          <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Gender</label><select name="gender" value={form.gender} onChange={handleChange} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"><option>Male</option><option>Female</option><option>Other</option></select></div>
          <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Course *</label><input name="course" value={form.course} onChange={handleChange} required className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
          <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Year *</label><input name="year" value={form.year} onChange={handleChange} required className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
          <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Date of Birth</label><input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
          <div>
            <label className="block text-sm font-medium text-[#1e293b] mb-1">Room</label>
            <select name="roomNumber" value={form.roomNumber} onChange={handleChange} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option value="">Not assigned</option>
              {rooms.map((r) => (
                <option key={r._id} value={r.roomNumber} disabled={r.occupants >= r.capacity}>
                  Room {r.roomNumber} — {r.type} ({r.occupants}/{r.capacity})
                </option>
              ))}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Parent Name</label><input name="parentName" value={form.parentName} onChange={handleChange} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
          <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Parent Phone</label><input name="parentPhone" value={form.parentPhone} onChange={handleChange} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
        </div>
        <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Address</label><textarea name="address" value={form.address} onChange={handleChange} rows={2} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
        <div className="flex items-center gap-4 pt-2">
          <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">Add Student</button>
          <button type="button" onClick={() => navigate("/students")} className="px-6 py-2.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#64748b] rounded-lg font-medium transition">Cancel</button>
        </div>
      </form>
    </div>
  );
}
