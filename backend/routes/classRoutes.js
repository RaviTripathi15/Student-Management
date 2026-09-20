const express = require('express');
const router = express.Router();
const {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
} = require('../controllers/classController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(protect);

router.get('/', getAllClasses);
router.get('/:id', getClassById);
router.post('/', authorize('admin'), createClass);
router.put('/:id', authorize('admin'), updateClass);
router.delete('/:id', authorize('admin'), deleteClass);

module.exports = router;
