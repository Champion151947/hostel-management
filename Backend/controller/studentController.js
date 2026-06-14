import Student from "../models/Student.js";
import Room from "../models/Room.js";

const updateRoomOccupants = async (roomNumber, delta) => {
  if (!roomNumber) return;
  await Room.findOneAndUpdate({ roomNumber }, { $inc: { occupants: delta } });
};

export const getStudents = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { course: { $regex: search, $options: "i" } },
      ];
    }
    if (status) query.status = status;
    const total = await Student.countDocuments(query);
    const students = await Student.find(query).select("-password").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ students, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    await updateRoomOccupants(student.roomNumber, 1);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const existing = await Student.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Student not found" });

    if (existing.roomNumber !== req.body.roomNumber) {
      await updateRoomOccupants(existing.roomNumber, -1);
      await updateRoomOccupants(req.body.roomNumber, 1);
    }

    const { password, ...rest } = req.body;
    Object.assign(existing, rest);
    if (password) existing.password = password;
    const student = await existing.save();
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    await updateRoomOccupants(student.roomNumber, -1);
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentStats = async (req, res) => {
  try {
    const total = await Student.countDocuments();
    const active = await Student.countDocuments({ status: "Active" });
    const inactive = await Student.countDocuments({ status: "Inactive" });
    res.json({ total, active, inactive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
