import express from "express";
import { getComplaints, getComplaint, createComplaint, updateComplaint, deleteComplaint, getComplaintStats } from "../controller/complaintController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getComplaintStats);
router.route("/").get(protect, getComplaints).post(protect, createComplaint);
router.route("/:id").get(protect, getComplaint).put(protect, updateComplaint).delete(protect, deleteComplaint);

export default router;
