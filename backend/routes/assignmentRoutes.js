import express from "express";
import {
  getAllAssignments,
  getAssignmentById,
  getAssignmentsByClass,
  getAssignmentsByTeacher,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  closeAssignment
} from "../controllers/assignmentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin and Teacher can view all assignments
router.get("/", authorize("Admin", "Teacher"), getAllAssignments);

// Admin, Teacher, and Student can view assignments by class
router.get("/class/:classId", authorize("Admin", "Teacher", "Student"), getAssignmentsByClass);

// Admin and Teacher can view assignments by teacher
router.get("/teacher/:teacherId", authorize("Admin", "Teacher"), getAssignmentsByTeacher);

// Admin, Teacher, and Student can view single assignment
router.get("/:id", authorize("Admin", "Teacher", "Student"), getAssignmentById);

// Admin and Teacher can create, update, delete assignments
router.post("/", authorize("Admin", "Teacher"), createAssignment);
router.put("/:id", authorize("Admin", "Teacher"), updateAssignment);
router.delete("/:id", authorize("Admin", "Teacher"), deleteAssignment);

// Close assignment
router.put("/:id/close", authorize("Admin", "Teacher"), closeAssignment);

export default router;
