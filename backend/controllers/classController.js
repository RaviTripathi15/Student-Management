import Class from "../models/Class.js";

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private (Admin, Teacher)
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("classTeacher", "name employeeId")
      .populate("subjects", "name code")
      .populate("students", "rollNumber")
      .sort({ grade: 1, section: 1 });
    
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Private (Admin, Teacher)
export const getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate("classTeacher", "name employeeId phone")
      .populate("subjects", "name code credits totalMarks")
      .populate("students", "rollNumber")
      .populate({
        path: "students",
        populate: { path: "user", select: "name email" }
      });
    
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }
    
    res.json(classData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create new class
// @route   POST /api/classes
// @access  Private (Admin)
export const createClass = async (req, res) => {
  try {
    const classData = await Class.create(req.body);
    
    // Set class teacher if provided
    if (req.body.classTeacher) {
      const Teacher = (await import("../models/Teacher.js")).default;
      await Teacher.findByIdAndUpdate(
        req.body.classTeacher,
        { $push: { classes: classData._id } }
      );
    }
    
    res.status(201).json(classData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private (Admin)
export const updateClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }
    
    res.json(classData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private (Admin)
export const deleteClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndDelete(req.params.id);
    
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }
    
    // Remove class from class teacher
    if (classData.classTeacher) {
      const Teacher = (await import("../models/Teacher.js")).default;
      await Teacher.findByIdAndUpdate(
        classData.classTeacher,
        { $pull: { classes: classData._id } }
      );
    }
    
    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Add student to class
// @route   POST /api/classes/:id/students
// @access  Private (Admin)
export const addStudentToClass = async (req, res) => {
  try {
    const { studentId } = req.body;
    
    const classData = await Class.findByIdAndUpdate(
      req.params.id,
      { $push: { students: studentId } },
      { new: true }
    );
    
    // Update student's class
    const Student = (await import("../models/Student.js")).default;
    await Student.findByIdAndUpdate(
      studentId,
      { class: req.params.id }
    );
    
    res.json(classData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Remove student from class
// @route   DELETE /api/classes/:id/students/:studentId
// @access  Private (Admin)
export const removeStudentFromClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndUpdate(
      req.params.id,
      { $pull: { students: req.params.studentId } },
      { new: true }
    );
    
    // Update student's class
    const Student = (await import("../models/Student.js")).default;
    await Student.findByIdAndUpdate(
      req.params.studentId,
      { class: null }
    );
    
    res.json(classData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
