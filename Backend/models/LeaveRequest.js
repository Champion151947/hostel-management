import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  reason: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  type: { type: String, enum: ["Medical", "Personal", "Family", "Other"], default: "Personal" },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  adminResponse: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("LeaveRequest", leaveRequestSchema);
