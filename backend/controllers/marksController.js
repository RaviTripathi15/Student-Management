const Mark = require('../models/Mark');

const getAllMarks = async (req, res) => {
  try {
    const { student, subject, class: classId } = req.query;
    const filter = {};
    if (student) filter.student = student;
    if (subject) filter.subject = subject;
    if (classId) filter.class = classId;

    const marks = await Mark.find(filter)
      .populate('student')
      .populate('subject')
      .populate('class')
      .sort({ examDate: -1 });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMarksById = async (req, res) => {
  try {
    const mark = await Mark.findById(req.params.id)
      .populate('student')
      .populate('subject')
      .populate('class');
    if (!mark) {
      return res.status(404).json({ message: 'Mark not found' });
    }
    res.json(mark);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createMarks = async (req, res) => {
  try {
    const mark = await Mark.create(req.body);
    res.status(201).json(mark);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateMarks = async (req, res) => {
  try {
    const mark = await Mark.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mark) {
      return res.status(404).json({ message: 'Mark not found' });
    }
    res.json(mark);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteMarks = async (req, res) => {
  try {
    const mark = await Mark.findByIdAndDelete(req.params.id);
    if (!mark) {
      return res.status(404).json({ message: 'Mark not found' });
    }
    res.json({ message: 'Mark deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllMarks,
  getMarksById,
  createMarks,
  updateMarks,
  deleteMarks
};
