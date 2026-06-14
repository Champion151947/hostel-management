import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { User, Mail, BookOpen, Home, Calendar, Phone, Plus, AlertCircle, LogOut } from "lucide-react";
import Modal from "../components/Modal.jsx";

export default function StudentDashboard() {
  const { admin: student, authAxios, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [fees, setFees] = useState([]);

  const [complaintModal, setComplaintModal] = useState(false);
  const [leaveModal, setLeaveModal] = useState(false);
  const [cForm, setCForm] = useState({ title: "", description: "", category: "Other", priority: "Medium" });
  const [lForm, setLForm] = useState({ reason: "", fromDate: "", toDate: "", type: "Personal" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = () => {
    if (!student) return;
    authAxios.get(`/complaints?email=${student.email}`).then(({ data }) => setComplaints(data.complaints || [])).catch(() => {});
    authAxios.get(`/leaves?email=${student.email}`).then(({ data }) => setLeaves(data.leaves || [])).catch(() => {});
    authAxios.get(`/fees?email=${student.email}`).then(({ data }) => setFees(data.fees || [])).catch(() => {});
  };

  useEffect(() => { fetchData(); }, [student]);

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await authAxios.post("/complaints", { ...cForm, student: student._id });
      setComplaintModal(false);
      setCForm({ title: "", description: "", category: "Other", priority: "Medium" });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register complaint");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await authAxios.post("/leaves", { ...lForm, student: student._id });
      setLeaveModal(false);
      setLForm({ reason: "", fromDate: "", toDate: "", type: "Personal" });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit leave request");
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status) => {
    const styles = {
      Pending: "bg-amber-100 text-amber-700",
      Approved: "bg-green-100 text-green-700",
      Rejected: "bg-red-100 text-red-700",
      "In Progress": "bg-blue-100 text-blue-700",
      Resolved: "bg-green-100 text-green-700",
    };
    return `px-2 py-0.5 rounded text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`;
  };

  if (!student) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">Student Dashboard</h1>
        <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center gap-2"><User size={20} className="text-blue-600" /> Profile</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-[#475569]"><User size={16} /> {student.name}</div>
            <div className="flex items-center gap-2 text-[#475569]"><Mail size={16} /> {student.email}</div>
            <div className="flex items-center gap-2 text-[#475569]"><BookOpen size={16} /> {student.course} — {student.year}</div>
            <div className="flex items-center gap-2 text-[#475569]"><Home size={16} /> Room {student.roomNumber}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1e293b] mb-4">Quick Summary</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{complaints.length}</div>
              <div className="text-xs text-[#64748b]">Complaints</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-amber-600">{leaves.length}</div>
              <div className="text-xs text-[#64748b]">Leave Requests</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">{fees.length}</div>
              <div className="text-xs text-[#64748b]">Fee Records</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[#1e293b] flex items-center gap-2"><AlertCircle size={18} className="text-blue-600" /> Complaints</h3>
            <button onClick={() => { setComplaintModal(true); setError(""); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition">
              <Plus size={15} /> Register
            </button>
          </div>
          {complaints.length === 0 ? (
            <p className="text-sm text-[#94a3b8]">No complaints filed.</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {complaints.map((c) => (
                <div key={c._id} className="p-3 bg-[#f8fafc] rounded-lg text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-[#1e293b]">{c.title}</span>
                    <span className={statusBadge(c.status)}>{c.status}</span>
                  </div>
                  <p className="text-[#64748b] text-xs line-clamp-2">{c.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[#1e293b] flex items-center gap-2"><Calendar size={18} className="text-amber-600" /> Leave Requests</h3>
            <button onClick={() => { setLeaveModal(true); setError(""); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm transition">
              <Plus size={15} /> New Request
            </button>
          </div>
          {leaves.length === 0 ? (
            <p className="text-sm text-[#94a3b8]">No leave requests filed.</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {leaves.map((l) => (
                <div key={l._id} className="p-3 bg-[#f8fafc] rounded-lg text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-[#1e293b] capitalize">{l.type}</span>
                    <span className={statusBadge(l.status)}>{l.status}</span>
                  </div>
                  <p className="text-[#64748b] text-xs mb-1">{new Date(l.fromDate).toLocaleDateString()} — {new Date(l.toDate).toLocaleDateString()}</p>
                  <p className="text-[#475569] text-xs line-clamp-2">{l.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm">
        <h3 className="font-semibold text-[#1e293b] mb-3 flex items-center gap-2"><Phone size={18} className="text-green-600" /> Fee Records</h3>
        {fees.length === 0 ? (
          <p className="text-sm text-[#94a3b8]">No fee records found.</p>
        ) : (
          <div className="space-y-2">
            {fees.map((f) => (
              <div key={f._id} className="flex justify-between items-center text-sm p-3 bg-[#f8fafc] rounded-lg">
                <span className="text-[#475569]">{f.description || f.feeType}: ₹{f.amount}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  f.paid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>{f.paid ? "Paid" : "Pending"}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={complaintModal} onClose={() => setComplaintModal(false)} title="Register Complaint">
        <form onSubmit={handleComplaintSubmit} className="space-y-3">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-[#1e293b] mb-1">Title *</label>
            <input value={cForm.title} onChange={(e) => setCForm({ ...cForm, title: e.target.value })} required
              className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-1">Category</label>
              <select value={cForm.category} onChange={(e) => setCForm({ ...cForm, category: e.target.value })}
                className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <option>Electricity</option><option>Plumbing</option><option>Cleaning</option><option>Noise</option><option>Safety</option><option>Food</option><option>Furniture</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-1">Priority</label>
              <select value={cForm.priority} onChange={(e) => setCForm({ ...cForm, priority: e.target.value })}
                className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1e293b] mb-1">Description *</label>
            <textarea value={cForm.description} onChange={(e) => setCForm({ ...cForm, description: e.target.value })} required rows={4}
              className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium text-sm transition">
            {submitting ? "Submitting..." : "Register Complaint"}
          </button>
        </form>
      </Modal>

      <Modal open={leaveModal} onClose={() => setLeaveModal(false)} title="New Leave Request">
        <form onSubmit={handleLeaveSubmit} className="space-y-3">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-1">From Date *</label>
              <input type="date" value={lForm.fromDate} onChange={(e) => setLForm({ ...lForm, fromDate: e.target.value })} required
                className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-1">To Date *</label>
              <input type="date" value={lForm.toDate} onChange={(e) => setLForm({ ...lForm, toDate: e.target.value })} required
                className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1e293b] mb-1">Type</label>
            <select value={lForm.type} onChange={(e) => setLForm({ ...lForm, type: e.target.value })}
              className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option>Medical</option><option>Personal</option><option>Family</option><option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1e293b] mb-1">Reason *</label>
            <textarea value={lForm.reason} onChange={(e) => setLForm({ ...lForm, reason: e.target.value })} required rows={3}
              className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white rounded-lg font-medium text-sm transition">
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
