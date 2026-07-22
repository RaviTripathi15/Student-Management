import express from "express";
import {
  getAllAttendance,
  getAttendanceByStudent,
  getAttendanceByClassAndDate,
  markAttendance,
  markBulkAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceStats
} from "../controllers/attendanceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin and Teacher can view all attendance
router.get("/", authorize("Admin", "Teacher"), getAllAttendance);

// Admin, Teacher, and Student (own records) can view attendance by student
router.get("/student/:studentId", authorize("Admin", "Teacher", "Student"), getAttendanceByStudent);

// Admin and Teacher can view attendance by class and date
router.get("/class/:classId/date/:date", authorize("Admin", "Teacher"), getAttendanceByClassAndDate);

// Admin and Teacher can mark attendance
router.post("/", authorize("Admin", "Teacher"), markAttendance);
router.post("/bulk", authorize("Admin", "Teacher"), markBulkAttendance);

// Admin and Teacher can update attendance
router.put("/:id", authorize("Admin", "Teacher"), updateAttendance);

// Only Admin can delete attendance
router.delete("/:id", authorize("Admin"), deleteAttendance);

// Get attendance statistics
router.get("/stats/:studentId", authorize("Admin", "Teacher", "Student"), getAttendanceStats);

export default router;
