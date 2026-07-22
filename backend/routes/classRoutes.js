import express from "express";
import {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass
} from "../controllers/classController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin and Teacher can view all classes
router.get("/", authorize("Admin", "Teacher"), getAllClasses);

// Admin and Teacher can view single class
router.get("/:id", authorize("Admin", "Teacher"), getClassById);

// Only Admin can create, update, delete classes
router.post("/", authorize("Admin"), createClass);
router.put("/:id", authorize("Admin"), updateClass);
router.delete("/:id", authorize("Admin"), deleteClass);

// Manage students in class
router.post("/:id/students", authorize("Admin"), addStudentToClass);
router.delete("/:id/students/:studentId", authorize("Admin"), removeStudentFromClass);

export default router;
