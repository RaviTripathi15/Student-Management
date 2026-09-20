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
