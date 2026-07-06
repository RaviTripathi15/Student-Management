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
