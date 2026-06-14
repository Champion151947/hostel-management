import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Plus, Search } from "lucide-react";

export default function Students() {
  const { authAxios } = useAuth();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await authAxios.get(`/students?search=${search}&page=${page}`);
      setStudents(data.students);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchStudents(); };

  const handleDelete = async (id) => {
    if (!confirm("Delete this student?")) return;
    try { await authAxios.delete(`/students/${id}`); fetchStudents(); } catch (err) { console.error(err); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">Students</h1>
        <Link to="/students/add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
          <Plus size={18} /> Add Student
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, or course..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e2e8f0] text-left text-sm text-[#64748b] bg-[#f8fafc]">
                  <th className="p-3 font-medium">Name</th><th className="p-3 font-medium">Email</th><th className="p-3 font-medium">Phone</th>
                  <th className="p-3 font-medium">Course</th><th className="p-3 font-medium">Year</th><th className="p-3 font-medium">Room</th>
                  <th className="p-3 font-medium">Status</th><th className="p-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id} className="border-b border-[#e2e8f0]/50 hover:bg-[#f8fafc]">
                    <td className="p-3 font-medium text-[#1e293b]">{s.name}</td><td className="p-3 text-[#64748b]">{s.email}</td>
                    <td className="p-3 text-[#64748b]">{s.phone}</td><td className="p-3 text-[#64748b]">{s.course}</td>
                    <td className="p-3 text-[#64748b]">{s.year}</td><td className="p-3 text-[#64748b]">{s.roomNumber}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/students/edit/${s._id}`} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">Edit</Link>
                        <button onClick={() => handleDelete(s._id)} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-[#94a3b8]">No students found</td></tr>}
              </tbody>
            </table>
          </div>
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {Array.from({ length: pages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${page === i + 1 ? "bg-blue-600 text-white" : "bg-white text-[#64748b] hover:bg-[#f1f5f9] border border-[#e2e8f0]"}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
