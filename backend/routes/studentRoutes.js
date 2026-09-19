<<<<<<< HEAD
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
=======
const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  getProfile,
  updateProfile,
  getAttendance,
  getAttendanceStats,
  getAssignments,
  getAssignmentById,
  getMarks,
  getMarksSummary
} = require('../controllers/studentController');

router.use(protect);
router.use(authorize('student'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

router.get('/attendance', getAttendance);
router.get('/attendance/stats', getAttendanceStats);

router.get('/assignments', getAssignments);
router.get('/assignments/:id', getAssignmentById);

router.get('/marks', getMarks);
router.get('/marks/summary', getMarksSummary);

module.exports = router;
>>>>>>> f433320e63b0b06420c9a1d7e9143a961f6f97f7
