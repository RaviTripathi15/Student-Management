import express from "express";
import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
} from "../controllers/teacherController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin can view all teachers
router.get("/", authorize("Admin"), getAllTeachers);

// Admin and Teacher (own profile) can view single teacher
router.get("/:id", authorize("Admin", "Teacher"), getTeacherById);

// Only Admin can create, update, delete teachers
router.post("/", authorize("Admin"), createTeacher);
router.put("/:id", authorize("Admin"), updateTeacher);
router.delete("/:id", authorize("Admin"), deleteTeacher);

export default router;
