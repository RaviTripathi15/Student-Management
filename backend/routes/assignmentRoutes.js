const express = require('express');
const router = express.Router();
const {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment
} = require('../controllers/assignmentController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(protect);

router.get('/', getAllAssignments);
router.get('/:id', getAssignmentById);
router.post('/', authorize('admin', 'teacher'), createAssignment);
router.put('/:id', authorize('admin', 'teacher'), updateAssignment);
router.delete('/:id', authorize('admin', 'teacher'), deleteAssignment);

module.exports = router;
