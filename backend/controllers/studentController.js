import Student from "../models/Student.js";

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin, Teacher)
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("user", "name email role")
      .populate("class", "name grade section")
      .sort({ createdAt: -1 });
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private (Admin, Teacher, Student - own profile)
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("user", "name email role")
      .populate("class", "name grade section")
      .populate("subjects", "name code");
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private (Admin)
export const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    
    // Add student to class if class is provided
    if (req.body.class) {
      const Class = (await import("../models/Class.js")).default;
      await Class.findByIdAndUpdate(
        req.body.class,
        { $push: { students: student._id } }
      );
    }
    
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Admin, Student - own profile)
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // Remove student from class
    if (student.class) {
      const Class = (await import("../models/Class.js")).default;
      await Class.findByIdAndUpdate(
        student.class,
        { $pull: { students: student._id } }
      );
    }
    
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get students by class
// @route   GET /api/students/class/:classId
// @access  Private (Admin, Teacher)
export const getStudentsByClass = async (req, res) => {
  try {
    const students = await Student.find({ class: req.params.classId })
      .populate("user", "name email")
      .sort({ name: 1 });
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
