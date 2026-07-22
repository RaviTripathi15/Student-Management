import express from "express";
import {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} from "../controllers/subjectController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin and Teacher can view all subjects
router.get("/", authorize("Admin", "Teacher"), getAllSubjects);

// Admin and Teacher can view single subject
router.get("/:id", authorize("Admin", "Teacher"), getSubjectById);

// Only Admin can create, update, delete subjects
router.post("/", authorize("Admin"), createSubject);
router.put("/:id", authorize("Admin"), updateSubject);
router.delete("/:id", authorize("Admin"), deleteSubject);

export default router;
