import express from "express";
import {
  getAllMarks,
  getMarksByStudent,
  getMarksBySubject,
  getMarksByClass,
  createMarks,
  bulkCreateMarks,
  updateMarks,
  deleteMarks,
  getStudentReport
} from "../controllers/marksController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin and Teacher can view all marks
router.get("/", authorize("Admin", "Teacher"), getAllMarks);

// Admin, Teacher, and Student (own marks) can view marks by student
router.get("/student/:studentId", authorize("Admin", "Teacher", "Student"), getMarksByStudent);

// Admin and Teacher can view marks by subject
router.get("/subject/:subjectId", authorize("Admin", "Teacher"), getMarksBySubject);

// Admin and Teacher can view marks by class
router.get("/class/:classId", authorize("Admin", "Teacher"), getMarksByClass);

// Admin and Teacher can create, update, delete marks
router.post("/", authorize("Admin", "Teacher"), createMarks);
router.post("/bulk", authorize("Admin", "Teacher"), bulkCreateMarks);
router.put("/:id", authorize("Admin", "Teacher"), updateMarks);
router.delete("/:id", authorize("Admin"), deleteMarks);

// Get student performance report
router.get("/report/:studentId", authorize("Admin", "Teacher", "Student"), getStudentReport);

export default router;
