import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Plus, Search, Eye } from "lucide-react";
import Modal from "../components/Modal.jsx";

export default function Complaints() {
  const { authAxios } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchComplaints = async () => {
    try {
      const params = `?page=${page}${statusFilter ? `&status=${statusFilter}` : ""}`;
      const { data } = await authAxios.get(`/complaints${params}`);
      setComplaints(data.complaints);
      setPages(data.pages);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchComplaints(); }, [page, statusFilter]);
  useEffect(() => { setPage(1); }, [statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    try { await authAxios.put(`/complaints/${id}`, { status }); fetchComplaints(); } catch (err) { console.error(err); }
  };

  const statusColors = { Pending: "bg-yellow-500/20 text-yellow-400", "In Progress": "bg-blue-500/20 text-blue-400", Resolved: "bg-green-500/20 text-green-400", Rejected: "bg-red-500/20 text-red-400" };
  const priorityColors = { Low: "text-gray-400", Medium: "text-yellow-400", High: "text-orange-400", Urgent: "text-red-400" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">Complaint</h1>
        <Link to="/complaints/register" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
          <Plus size={18} /> Register Complaint
        </Link>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <Search size={18} className="text-[#94a3b8]" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
          <option value="">All Status</option><option value="Pending">Pending</option><option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option><option value="Rejected">Rejected</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {complaints.map((c) => (
          <div key={c._id} className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-[#1e293b]">{c.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status]}`}>{c.status}</span>
                  <span className={`text-xs font-medium ${priorityColors[c.priority]}`}>{c.priority}</span>
                </div>
                <p className="text-sm text-[#64748b] mb-1"><span className="font-medium text-[#1e293b]">Student:</span> {c.student?.name} ({c.student?.email})</p>
                <p className="text-sm text-[#64748b]"><span className="font-medium text-[#1e293b]">Category:</span> {c.category}</p>
                <p className="text-sm text-[#64748b] line-clamp-2 mt-1">{c.description}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button onClick={() => { setSelected(c); setModalOpen(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Eye size={16} /></button>
                {c.status !== "Resolved" && c.status !== "Rejected" && (
                  <select value={c.status} onChange={(e) => handleUpdateStatus(c._id, e.target.value)}
                    className="text-xs bg-[#f1f5f9] border border-[#cbd5e1] rounded px-2 py-1 text-[#1e293b]">
                    <option value="Pending">Pending</option><option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option><option value="Rejected">Rejected</option>
                  </select>
                )}
              </div>
            </div>
          </div>
        ))}
        {complaints.length === 0 && <div className="text-center py-12 text-[#94a3b8]">No complaints found</div>}
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg text-sm ${page === i + 1 ? "bg-blue-600 text-white" : "bg-white text-[#64748b] hover:bg-[#f1f5f9] border border-[#e2e8f0]"}`}>{i + 1}</button>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Complaint Details">
        {selected && (
          <div className="space-y-3">
            <div><span className="text-[#64748b] text-sm">Student:</span><p className="font-medium text-[#1e293b]">{selected.student?.name} ({selected.student?.email})</p></div>
            <div><span className="text-[#64748b] text-sm">Title:</span><p className="font-medium text-[#1e293b]">{selected.title}</p></div>
            <div><span className="text-[#64748b] text-sm">Category:</span><p className="font-medium text-[#1e293b]">{selected.category}</p></div>
            <div><span className="text-[#64748b] text-sm">Priority:</span><p className={`font-medium ${priorityColors[selected.priority]}`}>{selected.priority}</p></div>
            <div><span className="text-[#64748b] text-sm">Status:</span><p className="font-medium text-[#1e293b]">{selected.status}</p></div>
            <div><span className="text-[#64748b] text-sm">Description:</span><p className="text-[#475569] mt-1">{selected.description}</p></div>
            {selected.adminResponse && <div><span className="text-[#64748b] text-sm">Admin Response:</span><p className="text-[#475569] mt-1">{selected.adminResponse}</p></div>}
            <div className="text-xs text-[#94a3b8]">Submitted: {new Date(selected.createdAt).toLocaleString()}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
