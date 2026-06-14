import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ArrowLeft } from "lucide-react";

export default function RegisterComplaint() {
  const { authAxios } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ student: "", title: "", description: "", category: "Other", priority: "Medium" });
  const [error, setError] = useState("");

  useEffect(() => { authAxios.get("/students?limit=100").then(({ data }) => setStudents(data.students)).catch(() => {}); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try { await authAxios.post("/complaints", form); navigate("/complaints"); }
    catch (err) { setError(err.response?.data?.message || "Failed to register complaint"); }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/complaints")} className="p-2 hover:bg-[#f1f5f9] rounded-lg text-[#64748b]"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold text-[#1e293b]">Register Complaint</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl bg-white rounded-xl border border-[#e2e8f0] p-6 space-y-4 shadow-sm">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-[#1e293b] mb-1">Student *</label>
          <select name="student" value={form.student} onChange={handleChange} required className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <option value="">Select student</option>
            {students.map((s) => <option key={s._id} value={s._id}>{s.name} - {s.email}</option>)}
          </select>
        </div>
        <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Title *</label><input name="title" value={form.title} onChange={handleChange} required className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Category</label><select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <option>Electricity</option><option>Plumbing</option><option>Cleaning</option><option>Noise</option><option>Safety</option><option>Food</option><option>Furniture</option><option>Other</option>
          </select></div>
          <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Priority</label><select name="priority" value={form.priority} onChange={handleChange} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
          </select></div>
        </div>
        <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Description *</label><textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
        <div className="flex items-center gap-4 pt-2">
          <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">Register Complaint</button>
          <button type="button" onClick={() => navigate("/complaints")} className="px-6 py-2.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#64748b] rounded-lg font-medium transition">Cancel</button>
        </div>
      </form>
    </div>
  );
}
