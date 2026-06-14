import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Users, Bug, DoorOpen, UserCheck, UserX, Clock, CheckCircle, BedSingle } from "lucide-react";

export default function Dashboard() {
  const { authAxios } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    Promise.all([
      authAxios.get("/rooms"),
      authAxios.get("/students?limit=100"),
      authAxios.get("/students/stats"),
      authAxios.get("/complaints/stats"),
      authAxios.get("/rooms/stats"),
    ]).then(([r, s, st, c, rm]) => {
      setRooms(r.data.slice(0, 8));
      setStudents(s.data.students);
      setStats({ students: st.data, complaints: c.data, rooms: rm.data });
    }).catch(() => {});
  }, []);

  const studentsByRoom = {};
  students.forEach((s) => {
    if (!studentsByRoom[s.roomNumber]) studentsByRoom[s.roomNumber] = [];
    if (studentsByRoom[s.roomNumber].length < 2) studentsByRoom[s.roomNumber].push(s);
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1e293b] mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
        {rooms.map((room) => {
          const occupants = studentsByRoom[room.roomNumber] || [];
          return (
            <div key={room._id} className="bg-white rounded-lg border border-[#e2e8f0] p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <BedSingle size={16} className="text-blue-600" />
                <span className="font-semibold text-sm text-[#1e293b]">Room {room.roomNumber}</span>
                <span className="ml-auto text-xs text-[#64748b]">{room.type}</span>
              </div>
              <div className="space-y-1.5">
                {occupants.length > 0 ? occupants.map((s) => (
                  <div key={s._id} className="flex items-center gap-2 bg-[#f8fafc] rounded px-2 py-1">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">
                      {s.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#1e293b] truncate">{s.name}</p>
                      <p className="text-[10px] text-[#94a3b8]">{s.course} - Yr {s.year}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-[#94a3b8] text-center py-2">Vacant</p>
                )}
              </div>
              <div className="mt-2 pt-2 border-t border-[#e2e8f0] flex items-center justify-between text-[10px] text-[#94a3b8]">
                <span>Cap: {room.capacity}</span>
                <span className={`font-medium ${room.occupants >= room.capacity ? "text-red-500" : "text-green-600"}`}>
                  {room.occupants}/{room.capacity}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[#64748b] text-sm font-medium">Total Students</h3>
            <div className="p-2 rounded-lg bg-blue-500 text-white"><Users size={18} /></div>
          </div>
          <p className="text-3xl font-bold text-[#1e293b] mb-3">{stats.students?.total ?? 0}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-[#64748b]"><UserCheck size={14} className="text-green-500" /> Active: <span className="font-semibold text-[#1e293b]">{stats.students?.active ?? 0}</span></span>
            <span className="flex items-center gap-1 text-[#64748b]"><UserX size={14} className="text-red-500" /> Inactive: <span className="font-semibold text-[#1e293b]">{stats.students?.inactive ?? 0}</span></span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[#64748b] text-sm font-medium">Complaints</h3>
            <div className="p-2 rounded-lg bg-yellow-500 text-white"><Bug size={18} /></div>
          </div>
          <p className="text-3xl font-bold text-[#1e293b] mb-3">{stats.complaints?.total ?? 0}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-[#64748b]"><Clock size={14} className="text-yellow-500" /> Pending: <span className="font-semibold text-[#1e293b]">{stats.complaints?.pending ?? 0}</span></span>
            <span className="flex items-center gap-1 text-[#64748b]"><CheckCircle size={14} className="text-green-500" /> Resolved: <span className="font-semibold text-[#1e293b]">{stats.complaints?.resolved ?? 0}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
