const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  getDashboardStats,
  linkUserToProfile,
  getUsers
} = require('../controllers/adminController');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);

// User management
router.get('/users', getUsers);
router.post('/users/link', linkUserToProfile);

router.post('/students', createStudent);
router.get('/students', getStudents);
router.get('/students/:id', getStudentById);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

router.post('/teachers', createTeacher);
router.get('/teachers', getTeachers);
router.get('/teachers/:id', getTeacherById);
router.put('/teachers/:id', updateTeacher);
router.delete('/teachers/:id', deleteTeacher);

router.post('/classes', createClass);
router.get('/classes', getClasses);
router.get('/classes/:id', getClassById);
router.put('/classes/:id', updateClass);
router.delete('/classes/:id', deleteClass);

router.post('/subjects', createSubject);
router.get('/subjects', getSubjects);
router.get('/subjects/:id', getSubjectById);
router.put('/subjects/:id', updateSubject);
router.delete('/subjects/:id', deleteSubject);

module.exports = router;
