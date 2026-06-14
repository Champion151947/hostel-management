import express from "express";
import { getLeaves, getLeave, createLeave, updateLeave, deleteLeave, getLeaveStats } from "../controller/leaveController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getLeaveStats);
router.route("/").get(protect, getLeaves).post(protect, createLeave);
router.route("/:id").get(protect, getLeave).put(protect, updateLeave).delete(protect, deleteLeave);

export default router;
