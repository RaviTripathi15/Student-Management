const express = require('express');
const router = express.Router();
const {
  getAllMarks,
  getMarksById,
  createMarks,
  updateMarks,
  deleteMarks
} = require('../controllers/marksController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(protect);

router.get('/', getAllMarks);
router.get('/:id', getMarksById);
router.post('/', authorize('admin', 'teacher'), createMarks);
router.put('/:id', authorize('admin', 'teacher'), updateMarks);
router.delete('/:id', authorize('admin', 'teacher'), deleteMarks);

module.exports = router;
