import express from "express";
import { getStudents, getStudent, createStudent, updateStudent, deleteStudent, getStudentStats } from "../controller/studentController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getStudentStats);
router.route("/").get(protect, getStudents).post(protect, adminOnly, createStudent);
router.route("/:id").get(protect, getStudent).put(protect, adminOnly, updateStudent).delete(protect, adminOnly, deleteStudent);

export default router;
