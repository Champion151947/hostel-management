import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Plus, Edit2, Trash2, DoorOpen } from "lucide-react";
import Modal from "../components/Modal.jsx";

export default function Rooms() {
  const { authAxios } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [form, setForm] = useState({ roomNumber: "", floor: "", capacity: "", type: "Double", status: "Available", amenities: "" });

  const fetchRooms = async () => { try { const { data } = await authAxios.get("/rooms"); setRooms(data); } catch (err) { console.error(err); } };

  useEffect(() => { fetchRooms(); }, []);

  const openAdd = () => { setEditRoom(null); setForm({ roomNumber: "", floor: "", capacity: "", type: "Double", status: "Available", amenities: "" }); setModalOpen(true); };

  const openEdit = (room) => { setEditRoom(room); setForm({ roomNumber: room.roomNumber, floor: room.floor, capacity: room.capacity, type: room.type, status: room.status, amenities: (room.amenities || []).join(", ") }); setModalOpen(true); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, floor: Number(form.floor), capacity: Number(form.capacity), amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean) };
      if (editRoom) await authAxios.put(`/rooms/${editRoom._id}`, payload);
      else await authAxios.post("/rooms", payload);
      setModalOpen(false); fetchRooms();
    } catch (err) { alert(err.response?.data?.message || "Failed to save room"); }
  };

  const handleDelete = async (id) => { if (!confirm("Delete this room?")) return; try { await authAxios.delete(`/rooms/${id}`); fetchRooms(); } catch (err) { console.error(err); } };

  const statusColors = { Available: "bg-green-100 text-green-700", Full: "bg-red-100 text-red-700", Maintenance: "bg-yellow-100 text-yellow-700" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">Rooms</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"><Plus size={18} /> Add Room</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div key={room._id} className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg"><DoorOpen size={20} className="text-purple-600" /></div>
                <div><h3 className="font-semibold text-[#1e293b]">Room {room.roomNumber}</h3><p className="text-sm text-[#64748b]">Floor {room.floor} - {room.type}</p></div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[room.status]}`}>{room.status}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-[#64748b] mb-3">
              <span>Capacity: {room.capacity}</span><span>Occupied: {room.occupants}</span>
            </div>
            {room.amenities?.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">{room.amenities.map((a, i) => <span key={i} className="px-2 py-0.5 bg-[#f1f5f9] rounded text-xs text-[#64748b]">{a}</span>)}</div>
            )}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e2e8f0]">
              <button onClick={() => openEdit(room)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(room._id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {rooms.length === 0 && <div className="col-span-full text-center py-12 text-[#94a3b8]">No rooms added yet</div>}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editRoom ? "Edit Room" : "Add Room"}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm text-[#1e293b] mb-1">Room Number</label><input name="roomNumber" value={form.roomNumber} onChange={handleChange} required className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
            <div><label className="block text-sm text-[#1e293b] mb-1">Floor</label><input name="floor" type="number" value={form.floor} onChange={handleChange} required className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
            <div><label className="block text-sm text-[#1e293b] mb-1">Capacity</label><input name="capacity" type="number" value={form.capacity} onChange={handleChange} required className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
            <div><label className="block text-sm text-[#1e293b] mb-1">Type</label><select name="type" value={form.type} onChange={handleChange} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"><option>Single</option><option>Double</option></select></div>
            <div><label className="block text-sm text-[#1e293b] mb-1">Status</label><select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"><option>Available</option><option>Full</option><option>Maintenance</option></select></div>
          </div>
          <div><label className="block text-sm text-[#1e293b] mb-1">Amenities (comma separated)</label><input name="amenities" value={form.amenities} onChange={handleChange} placeholder="e.g. AC, Attached Bathroom, Balcony" className="w-full px-3 py-2 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
          <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition">{editRoom ? "Update Room" : "Add Room"}</button>
        </form>
      </Modal>
    </div>
  );
}
