import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Plus, Search, Eye, Edit2, Trash2 } from "lucide-react";
import Modal from "../components/Modal.jsx";

export default function FeeManagement() {
  const { authAxios } = useAuth();
  const [fees, setFees] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editFee, setEditFee] = useState(null);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ student: "", amount: "", paidAmount: "0", dueDate: "", type: "Tuition", status: "Pending", remarks: "" });
  const [error, setError] = useState("");

  const fetchFees = async () => {
    try {
      const params = `?page=${page}${statusFilter ? `&status=${statusFilter}` : ""}`;
      const { data } = await authAxios.get(`/fees${params}`);
      setFees(data.fees);
      setPages(data.pages);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchFees(); }, [page, statusFilter]);
  useEffect(() => { setPage(1); }, [statusFilter]);
  useEffect(() => { authAxios.get("/students?limit=100").then(({ data }) => setStudents(data.students)).catch(() => {}); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await authAxios.post("/fees", { ...form, amount: Number(form.amount), paidAmount: Number(form.paidAmount) });
      setAddModal(false); setForm({ student: "", amount: "", paidAmount: "0", dueDate: "", type: "Tuition", status: "Pending", remarks: "" });
      fetchFees();
    } catch (err) { setError(err.response?.data?.message || "Failed to create fee record"); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await authAxios.put(`/fees/${editFee._id}`, { ...editFee, amount: Number(editFee.amount), paidAmount: Number(editFee.paidAmount) });
      setEditModal(false); setEditFee(null); fetchFees();
    } catch (err) { setError(err.response?.data?.message || "Failed to update fee record"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this fee record?")) return;
    try { await authAxios.delete(`/fees/${id}`); fetchFees(); } catch (err) { console.error(err); }
  };

  const statusColors = { Pending: "bg-yellow-100 text-yellow-700", Partial: "bg-orange-100 text-orange-700", Paid: "bg-green-100 text-green-700", Overdue: "bg-red-100 text-red-700" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">Fee Management</h1>
        <button onClick={() => { setAddModal(true); setError(""); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
          <Plus size={18} /> Add Fee Record
        </button>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <Search size={18} className="text-[#94a3b8]" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
          <option value="">All Status</option><option value="Pending">Pending</option><option value="Partial">Partial</option><option value="Paid">Paid</option><option value="Overdue">Overdue</option>
        </select>
      </div>
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e2e8f0] text-left text-sm text-[#64748b] bg-[#f8fafc]">
              <th className="p-3 font-medium">Student</th><th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium">Amount</th><th className="p-3 font-medium">Paid</th>
              <th className="p-3 font-medium">Due Date</th><th className="p-3 font-medium">Status</th><th className="p-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((f) => (
              <tr key={f._id} className="border-b border-[#e2e8f0]/50 hover:bg-[#f8fafc]">
                <td className="p-3 font-medium text-[#1e293b]">{f.student?.name}</td>
                <td className="p-3 text-[#64748b]">{f.type}</td>
                <td className="p-3 text-[#1e293b] font-medium">${f.amount}</td>
                <td className="p-3 text-[#64748b]">${f.paidAmount}</td>
                <td className="p-3 text-[#64748b]">{new Date(f.dueDate).toLocaleDateString()}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[f.status]}`}>{f.status}</span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setSelected(f); setModalOpen(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Eye size={16} /></button>
                    <button onClick={() => { setEditFee(f); setEditModal(true); setError(""); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(f._id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {fees.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-[#94a3b8]">No fee records found</td></tr>}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg text-sm ${page === i + 1 ? "bg-blue-600 text-white" : "bg-white text-[#64748b] hover:bg-[#f1f5f9] border border-[#e2e8f0]"}`}>{i + 1}</button>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Fee Record Details">
        {selected && (
          <div className="space-y-3">
            <div><span className="text-[#64748b] text-sm">Student:</span><p className="font-medium text-[#1e293b]">{selected.student?.name} ({selected.student?.email})</p></div>
            <div><span className="text-[#64748b] text-sm">Type:</span><p className="font-medium text-[#1e293b]">{selected.type}</p></div>
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-[#64748b] text-sm">Total Amount:</span><p className="font-medium text-[#1e293b]">${selected.amount}</p></div>
              <div><span className="text-[#64748b] text-sm">Paid Amount:</span><p className="font-medium text-[#1e293b]">${selected.paidAmount}</p></div>
            </div>
            <div><span className="text-[#64748b] text-sm">Due Date:</span><p className="font-medium text-[#1e293b]">{new Date(selected.dueDate).toLocaleDateString()}</p></div>
            <div><span className="text-[#64748b] text-sm">Status:</span><p className="font-medium text-[#1e293b]">{selected.status}</p></div>
            {selected.remarks && <div><span className="text-[#64748b] text-sm">Remarks:</span><p className="text-[#475569] mt-1">{selected.remarks}</p></div>}
            {selected.paidAt && <div><span className="text-[#64748b] text-sm">Paid On:</span><p className="font-medium text-[#1e293b]">{new Date(selected.paidAt).toLocaleString()}</p></div>}
          </div>
        )}
      </Modal>
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Fee Record">
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>}
          <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Student *</label>
            <select value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })} required className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option value="">Select student</option>
              {students.map((s) => <option key={s._id} value={s._id}>{s.name} - {s.email}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Amount *</label><input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Paid Amount</label><input type="number" value={form.paidAmount} onChange={(e) => setForm({ ...form, paidAmount: e.target.value })} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Due Date *</label><input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Type *</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <option>Tuition</option><option>Hostel</option><option>Mess</option><option>Library</option><option>Other</option>
              </select>
            </div>
          </div>
          <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Remarks</label><textarea value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} rows={2} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
          <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition">Add Fee Record</button>
        </form>
      </Modal>
      <Modal open={editModal} onClose={() => { setEditModal(false); setEditFee(null); }} title="Edit Fee Record">
        {editFee && (
          <form onSubmit={handleUpdate} className="space-y-3">
            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>}
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Amount</label><input type="number" value={editFee.amount} onChange={(e) => setEditFee({ ...editFee, amount: e.target.value })} required className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
              <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Paid Amount</label><input type="number" value={editFee.paidAmount} onChange={(e) => setEditFee({ ...editFee, paidAmount: e.target.value })} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
              <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Due Date</label><input type="date" value={editFee.dueDate?.split("T")[0] || ""} onChange={(e) => setEditFee({ ...editFee, dueDate: e.target.value })} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
              <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Status</label>
                <select value={editFee.status} onChange={(e) => setEditFee({ ...editFee, status: e.target.value })} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option>Pending</option><option>Partial</option><option>Paid</option><option>Overdue</option>
                </select>
              </div>
            </div>
            <div><label className="block text-sm font-medium text-[#1e293b] mb-1">Remarks</label><textarea value={editFee.remarks} onChange={(e) => setEditFee({ ...editFee, remarks: e.target.value })} rows={2} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
            <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition">Update Fee Record</button>
          </form>
        )}
      </Modal>
    </div>
  );
}
