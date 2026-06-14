import express from "express";
import { getFees, getFee, createFee, updateFee, deleteFee, getFeeStats } from "../controller/feeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getFeeStats);
router.route("/").get(protect, getFees).post(protect, createFee);
router.route("/:id").get(protect, getFee).put(protect, updateFee).delete(protect, deleteFee);

export default router;
