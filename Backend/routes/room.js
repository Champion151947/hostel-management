import express from "express";
import { getRooms, getRoom, createRoom, updateRoom, deleteRoom, getRoomStats } from "../controller/roomController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getRoomStats);
router.route("/").get(protect, getRooms).post(protect, createRoom);
router.route("/:id").get(protect, getRoom).put(protect, updateRoom).delete(protect, deleteRoom);

export default router;
