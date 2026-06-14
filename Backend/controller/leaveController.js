import LeaveRequest from "../models/LeaveRequest.js";
import Student from "../models/Student.js";

export const getLeaves = async (req, res) => {
  try {
    const { status, email, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (email) {
      const student = await Student.findOne({ email });
      if (student) query.student = student._id;
      else return res.json({ leaves: [], total: 0, page: 1, pages: 0 });
    }
    const total = await LeaveRequest.countDocuments(query);
    const leaves = await LeaveRequest.find(query)
      .populate("student", "name email phone roomNumber course")
      .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ leaves, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id).populate("student", "name email phone roomNumber course");
    if (!leave) return res.status(404).json({ message: "Leave request not found" });
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.create(req.body);
    res.status(201).json(leave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate("student", "name email phone roomNumber course");
    if (!leave) return res.status(404).json({ message: "Leave request not found" });
    res.json(leave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findByIdAndDelete(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave request not found" });
    res.json({ message: "Leave request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeaveStats = async (req, res) => {
  try {
    const total = await LeaveRequest.countDocuments();
    const pending = await LeaveRequest.countDocuments({ status: "Pending" });
    const approved = await LeaveRequest.countDocuments({ status: "Approved" });
    const rejected = await LeaveRequest.countDocuments({ status: "Rejected" });
    res.json({ total, pending, approved, rejected });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
