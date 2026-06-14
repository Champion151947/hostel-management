import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  amount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueDate: { type: Date, required: true },
  type: { type: String, enum: ["Tuition", "Hostel", "Mess", "Library", "Other"], required: true },
  status: { type: String, enum: ["Pending", "Partial", "Paid", "Overdue"], default: "Pending" },
  paidAt: { type: Date },
  remarks: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Fee", feeSchema);
