import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Student from "../models/Student.js";
import { JWT_SECRET } from "../middleware/authMiddleware.js";

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" });

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });
    const admin = await Admin.create({ name, email, password });
    res.status(201).json({ _id: admin._id, name: admin.name, email: admin.email, role: "admin", token: generateToken(admin._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
      return res.json({ _id: admin._id, name: admin.name, email: admin.email, role: "admin", token: generateToken(admin._id) });
    }
    const student = await Student.findOne({ email });
    if (student && (await student.matchPassword(password))) {
      if (student.status === "Inactive") return res.status(403).json({ message: "Account is inactive" });
      return res.json({ _id: student._id, name: student.name, email: student.email, role: "student", roomNumber: student.roomNumber, course: student.course, year: student.year, token: generateToken(student._id) });
    }
    res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  if (req.admin) return res.json({ ...req.admin.toObject(), role: "admin" });

  const student = await Student.findById(req.user._id).select("-password");
  if (student) return res.json({ ...student.toObject(), role: "student" });

  res.status(404).json({ message: "User not found" });
};
