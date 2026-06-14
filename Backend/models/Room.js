import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  floor: { type: Number, required: true },
  capacity: { type: Number, required: true },
  occupants: { type: Number, default: 0 },
  type: { type: String, enum: ["Single", "Double"], default: "Double" },
  status: { type: String, enum: ["Available", "Full", "Maintenance"], default: "Available" },
  amenities: [{ type: String }],
}, { timestamps: true });

export default mongoose.model("Room", roomSchema);
