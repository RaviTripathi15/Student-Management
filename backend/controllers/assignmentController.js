import Assignment from "../models/Assignment.js";

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private (Admin, Teacher)
export const getAllAssignments = async (req, res) => {
  try {
    const { class: classId, subject, teacher, status } = req.query;
    
    const filter = {};
    if (classId) filter.class = classId;
    if (subject) filter.subject = subject;
    if (teacher) filter.teacher = teacher;
    if (status) filter.status = status;
    
    const assignments = await Assignment.find(filter)
      .populate("subject", "name code")
      .populate("class", "name grade section")
      .populate("teacher", "name employeeId")
      .sort({ dueDate: 1 });
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private (Admin, Teacher, Student)
export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate("subject", "name code totalMarks passMarks")
      .populate("class", "name grade section")
      .populate("teacher", "name email");
    
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get assignments by class
// @route   GET /api/assignments/class/:classId
// @access  Private (Admin, Teacher, Student)
export const getAssignmentsByClass = async (req, res) => {
  try {
    const assignments = await Assignment.find({ class: req.params.classId })
      .populate("subject", "name code")
      .populate("teacher", "name")
      .sort({ dueDate: 1 });
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get assignments by teacher
// @route   GET /api/assignments/teacher/:teacherId
// @access  Private (Admin, Teacher)
export const getAssignmentsByTeacher = async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacher: req.params.teacherId })
      .populate("subject", "name code")
      .populate("class", "name grade section")
      .sort({ dueDate: 1 });
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create new assignment
// @route   POST /api/assignments
// @access  Private (Admin, Teacher)
export const createAssignment = async (req, res) => {
  try {
    const assignmentData = {
      ...req.body,
      teacher: req.user._id
    };
    
    const assignment = await Assignment.create(assignmentData);
    
    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate("subject", "name code")
      .populate("class", "name grade section");
    
    res.status(201).json(populatedAssignment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private (Admin, Teacher - own assignments)
export const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Admin, Teacher - own assignments)
export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    
    // Delete related marks
    const Marks = (await import("../models/Marks.js")).default;
    await Marks.deleteMany({ assignment: req.params.id });
    
    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Close assignment
// @route   PUT /api/assignments/:id/close
// @access  Private (Admin, Teacher - own assignments)
export const closeAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { status: "Closed" },
      { new: true }
    );
    
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
