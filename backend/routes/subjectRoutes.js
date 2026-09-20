const express = require('express');
const router = express.Router();
const {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(protect);

router.get('/', getAllSubjects);
router.get('/:id', getSubjectById);
router.post('/', authorize('admin'), createSubject);
router.put('/:id', authorize('admin'), updateSubject);
router.delete('/:id', authorize('admin'), deleteSubject);

module.exports = router;
