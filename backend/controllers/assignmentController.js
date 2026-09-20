const Assignment = require('../models/Assignment');
const Mark = require('../models/Mark');

const getAllAssignments = async (req, res) => {
  try {
    const { class: classId, subject, teacher, status } = req.query;
    
    const filter = {};
    if (classId) filter.class = classId;
    if (subject) filter.subject = subject;
    if (teacher) filter.teacher = teacher;
    if (status) filter.status = status;
    
    const assignments = await Assignment.find(filter)
      .populate('subject', 'name code')
      .populate('class', 'name grade section')
      .populate('teacher', 'firstName lastName')
      .sort({ dueDate: 1 });
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('subject', 'name code')
      .populate('class', 'name grade section')
      .populate('teacher', 'firstName lastName email');
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create(req.body);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment
};
