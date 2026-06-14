import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Plus, Search, Check, X, Eye } from "lucide-react";
import Modal from "../components/Modal.jsx";

export default function LeaveRequests() {
  const { authAxios } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ student: "", reason: "", fromDate: "", toDate: "", type: "Personal" });
  const [error, setError] = useState("");

  const fetchLeaves = async () => {
    try {
      const params = `?page=${page}${statusFilter ? `&status=${statusFilter}` : ""}`;
      const { data } = await authAxios.get(`/leaves${params}`);
      setLeaves(data.leaves);
      setPages(data.pages);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchLeaves(); }, [page, statusFilter]);
  useEffect(() => { setPage(1); }, [statusFilter]);
  useEffect(() => { authAxios.get("/students?limit=100").then(({ data }) => setStudents(data.students)).catch(() => {}); }, []);

  const handleUpdateStatus = async (id, status) => {
    try { await authAxios.put(`/leaves/${id}`, { status }); fetchLeaves(); } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try { await authAxios.post("/leaves", form); setAddModal(false); setForm({ student: "", reason: "", fromDate: "", toDate: "", type: "Personal" }); fetchLeaves(); }
    catch (err) { setError(err.response?.data?.message || "Failed to create leave request"); }
  };

  const statusColors = { Pending: "bg-yellow-100 text-yellow-700", Approved: "bg-green-100 text-green-700", Rejected: "bg-red-100 text-red-700" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">Leave Requests</h1>
        <button onClick={() => { setAddModal(true); setError(""); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
          <Plus size={18} /> New Request
        </button>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <Search size={18} className="text-[#94a3b8]" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
          <option value="">All Status</option><option value="Pending">Pending</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {leaves.map((l) => (
          <div key={l._id} className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-[#1e293b]">{l.student?.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[l.status]}`}>{l.status}</span>
                  <span className="text-xs font-medium text-[#64748b]">{l.type}</span>
                </div>
                <p className="text-sm text-[#64748b] mb-1"><span className="font-medium text-[#1e293b]">From:</span> {new Date(l.fromDate).toLocaleDateString()} <span className="font-medium text-[#1e293b] ml-2">To:</span> {new Date(l.toDate).toLocaleDateString()}</p>
                <p className="text-sm text-[#64748b] line-clamp-2">{l.reason}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button onClick={() => { setSelected(l); setModalOpen(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Eye size={16} /></button>
                {l.status === "Pending" && (
                  <div className="flex gap-1">
                    <button onClick={() => handleUpdateStatus(l._id, "Approved")} className="p-1.5 hover:bg-green-50 rounded-lg text-green-600"><Check size={16} /></button>
                    <button onClick={() => handleUpdateStatus(l._id, "Rejected")} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><X size={16} /></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {leaves.length === 0 && <div className="text-center py-12 text-[#94a3b8]">No leave requests found</div>}
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg text-sm ${page === i + 1 ? "bg-blue-600 text-white" : "bg-white text-[#64748b] hover:bg-[#f1f5f9] border border-[#e2e8f0]"}`}>{i + 1}</button>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Leave Request Details">
        {selected && (
          <div className="space-y-3">
            <div><span className="text-[#64748b] text-sm">Student:</span><p className="font-medium text-[#1e293b]">{selected.student?.name} ({selected.student?.email})</p></div>
            <div><span className="text-[#64748b] text-sm">Type:</span><p className="font-medium text-[#1e293b]">{selected.type}</p></div>
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-[#64748b] text-sm">From:</span><p className="font-medium text-[#1e293b]">{new Date(selected.fromDate).toLocaleDateString()}</p></div>
              <div><span className="text-[#64748b] text-sm">To:</span><p className="font-medium text-[#1e293b]">{new Date(selected.toDate).toLocaleDateString()}</p></div>
            </div>
            <div><span className="text-[#64748b] text-sm">Status:</span><p className="font-medium text-[#1e293b]">{selected.status}</p></div>
            <div><span className="text-[#64748b] text-sm">Reason:</span><p className="text-[#475569] mt-1">{selected.reason}</p></div>
            {selected.adminResponse && <div><span className="text-[#64748b] text-sm">Admin Response:</span><p className="text-[#475569] mt-1">{selected.adminResponse}</p></div>}
            <div className="text-xs text-[#94a3b8]">Submitted: {new Date(selected.createdAt).toLocaleString()}</div>
          </div>
        )}
      </Modal>
      <Modal open={addModal} onClose={() => setAddModal(false)} title="New Leave Request">
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-[#1e293b] mb-1">Student *</label>
            <select name="student" value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })} required className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option value="">Select student</option>
              {students.map((s) => <option key={s._id} value={s._id}>{s.name} - {s.email}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-[#1e293b] mb-1">From Date *</label><input name="fromDate" type="date" value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} required className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-[#1e293b] mb-1">To Date *</label><input name="toDate" type="date" value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} required className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
          </div>
          <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Type</label><select name="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"><option>Medical</option><option>Personal</option><option>Family</option><option>Other</option></select></div>
          <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Reason *</label><textarea name="reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required rows={3} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
          <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition">Submit Request</button>
        </form>
      </Modal>
    </div>
  );
}
