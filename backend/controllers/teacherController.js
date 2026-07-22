import Teacher from "../models/Teacher.js";

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private (Admin)
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("user", "name email role")
      .populate("subjects", "name code")
      .populate("classes", "name grade section")
      .sort({ createdAt: -1 });
    
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single teacher
// @route   GET /api/teachers/:id
// @access  Private (Admin, Teacher - own profile)
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate("user", "name email role")
      .populate("subjects", "name code credits")
      .populate("classes", "name grade section");
    
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create new teacher
// @route   POST /api/teachers
// @access  Private (Admin)
export const createTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);
    
    // Add teacher to subjects if provided
    if (req.body.subjects && req.body.subjects.length > 0) {
      const Subject = (await import("../models/Subject.js")).default;
      await Subject.updateMany(
        { _id: { $in: req.body.subjects } },
        { $push: { teachers: teacher._id } }
      );
    }
    
    // Add teacher to classes if provided
    if (req.body.classes && req.body.classes.length > 0) {
      const Class = (await import("../models/Class.js")).default;
      await Class.updateMany(
        { _id: { $in: req.body.classes } },
        { $push: { subjects: teacher._id } }
      );
    }
    
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update teacher
// @route   PUT /api/teachers/:id
// @access  Private (Admin, Teacher - own profile)
export const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
// @access  Private (Admin)
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    
    // Remove teacher from subjects
    if (teacher.subjects && teacher.subjects.length > 0) {
      const Subject = (await import("../models/Subject.js")).default;
      await Subject.updateMany(
        { _id: { $in: teacher.subjects } },
        { $pull: { teachers: teacher._id } }
      );
    }
    
    // Remove teacher from classes
    if (teacher.classes && teacher.classes.length > 0) {
      const Class = (await import("../models/Class.js")).default;
      await Class.updateMany(
        { _id: { $in: teacher.classes } },
        { $pull: { subjects: teacher._id } }
      );
    }
    
    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
