import express from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByClass
} from "../controllers/studentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin and Teacher can view all students
router.get("/", authorize("Admin", "Teacher"), getAllStudents);

// Admin and Teacher can view students by class
router.get("/class/:classId", authorize("Admin", "Teacher"), getStudentsByClass);

// Admin, Teacher, and Student (own profile) can view single student
router.get("/:id", authorize("Admin", "Teacher", "Student"), getStudentById);

// Only Admin can create, update, delete students
router.post("/", authorize("Admin"), createStudent);
router.put("/:id", authorize("Admin"), updateStudent);
router.delete("/:id", authorize("Admin"), deleteStudent);

export default router;
