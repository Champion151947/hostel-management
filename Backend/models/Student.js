import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phone: { type: String, required: true },
  address: { type: String, default: "" },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  course: { type: String, required: true },
  year: { type: String, required: true },
  roomNumber: { type: String, default: "Not Assigned" },
  parentName: { type: String, default: "" },
  parentPhone: { type: String, default: "" },
  joiningDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
}, { timestamps: true });

studentSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

studentSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Student", studentSchema);
