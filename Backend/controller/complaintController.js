import Complaint from "../models/Complaint.js";
import Student from "../models/Student.js";

export const getComplaints = async (req, res) => {
  try {
    const { status, category, priority, email, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (email) {
      const student = await Student.findOne({ email });
      if (student) query.student = student._id;
      else return res.json({ complaints: [], total: 0, page: 1, pages: 0 });
    }
    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate("student", "name email phone roomNumber")
      .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ complaints, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("student", "name email phone roomNumber");
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create(req.body);
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate("student", "name email phone roomNumber");
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComplaintStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: "Pending" });
    const inProgress = await Complaint.countDocuments({ status: "In Progress" });
    const resolved = await Complaint.countDocuments({ status: "Resolved" });
    res.json({ total, pending, inProgress, resolved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
