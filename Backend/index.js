import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import "./db.js";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import complaintRoutes from "./routes/complaint.js";
import roomRoutes from "./routes/room.js";
import leaveRoutes from "./routes/leave.js";
import feeRoutes from "./routes/fee.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/fees", feeRoutes);

app.get("/", (req, res) => {
  res.send("Hostel Management System API is running...");
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
