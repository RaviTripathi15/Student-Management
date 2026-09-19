<<<<<<< HEAD
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
=======
const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  markAttendance,
  getClassAttendance,
  getStudentAttendance,
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission,
  createMark,
  getMarks,
  getStudentMarks,
  updateMark,
  deleteMark,
  getAssignedClasses,
  getClassStudents
} = require('../controllers/teacherController');

router.use(protect);
router.use(authorize('teacher'));

router.get('/assigned', getAssignedClasses);
router.get('/classes/:classId/students', getClassStudents);

router.post('/attendance', markAttendance);
router.get('/attendance/class', getClassAttendance);
router.get('/attendance/student/:studentId', getStudentAttendance);

router.post('/assignments', createAssignment);
router.get('/assignments', getAssignments);
router.get('/assignments/:id', getAssignmentById);
router.put('/assignments/:id', updateAssignment);
router.delete('/assignments/:id', deleteAssignment);
router.post('/assignments/:assignmentId/submit', submitAssignment);
router.put('/assignments/:assignmentId/submissions/:studentId/grade', gradeSubmission);

router.post('/marks', createMark);
router.get('/marks', getMarks);
router.get('/marks/student/:studentId', getStudentMarks);
router.put('/marks/:id', updateMark);
router.delete('/marks/:id', deleteMark);

module.exports = router;
>>>>>>> f433320e63b0b06420c9a1d7e9143a961f6f97f7
