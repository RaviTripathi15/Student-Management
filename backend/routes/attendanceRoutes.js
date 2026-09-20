const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendanceByClass,
  getAttendanceByStudent
} = require('../controllers/attendanceController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(protect);

router.post('/', authorize('admin', 'teacher'), markAttendance);
router.get('/class/:classId', getAttendanceByClass);
router.get('/student/:studentId', getAttendanceByStudent);

module.exports = router;
