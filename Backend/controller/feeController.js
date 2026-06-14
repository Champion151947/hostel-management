import Fee from "../models/Fee.js";
import Student from "../models/Student.js";

export const getFees = async (req, res) => {
  try {
    const { status, type, email, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (email) {
      const student = await Student.findOne({ email });
      if (student) query.student = student._id;
      else return res.json({ fees: [], total: 0, page: 1, pages: 0 });
    }
    const total = await Fee.countDocuments(query);
    const fees = await Fee.find(query)
      .populate("student", "name email phone roomNumber course")
      .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ fees, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate("student", "name email phone roomNumber course");
    if (!fee) return res.status(404).json({ message: "Fee record not found" });
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFee = async (req, res) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate("student", "name email phone roomNumber course");
    if (!fee) return res.status(404).json({ message: "Fee record not found" });
    res.json(fee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) return res.status(404).json({ message: "Fee record not found" });
    res.json({ message: "Fee record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeeStats = async (req, res) => {
  try {
    const total = await Fee.countDocuments();
    const pending = await Fee.countDocuments({ status: "Pending" });
    const partial = await Fee.countDocuments({ status: "Partial" });
    const paid = await Fee.countDocuments({ status: "Paid" });
    const overdue = await Fee.countDocuments({ status: "Overdue" });
    const totalAmount = await Fee.aggregate([{ $group: { _id: null, total: { $sum: "$amount" }, collected: { $sum: "$paidAmount" } } }]);
    res.json({ total, pending, partial, paid, overdue, ...(totalAmount[0] || { total: 0, collected: 0 }) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
