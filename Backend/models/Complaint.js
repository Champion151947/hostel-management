import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ["Electricity", "Plumbing", "Cleaning", "Noise", "Safety", "Food", "Furniture", "Other"],
    required: true,
  },
  priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
  status: { type: String, enum: ["Pending", "In Progress", "Resolved", "Rejected"], default: "Pending" },
  adminResponse: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Complaint", complaintSchema);
