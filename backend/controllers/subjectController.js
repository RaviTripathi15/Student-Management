import Subject from "../models/Subject.js";

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private (Admin, Teacher)
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("teachers", "name employeeId")
      .populate("classes", "name grade section")
      .sort({ name: 1 });
    
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single subject
// @route   GET /api/subjects/:id
// @access  Private (Admin, Teacher)
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate("teachers", "name employeeId department")
      .populate("classes", "name grade section");
    
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private (Admin)
export const createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    
    // Add subject to classes if provided
    if (req.body.classes && req.body.classes.length > 0) {
      const Class = (await import("../models/Class.js")).default;
      await Class.updateMany(
        { _id: { $in: req.body.classes } },
        { $push: { subjects: subject._id } }
      );
    }
    
    // Add subject to teachers if provided
    if (req.body.teachers && req.body.teachers.length > 0) {
      const Teacher = (await import("../models/Teacher.js")).default;
      await Teacher.updateMany(
        { _id: { $in: req.body.teachers } },
        { $push: { subjects: subject._id } }
      );
    }
    
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private (Admin)
export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private (Admin)
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    
    // Remove subject from classes
    if (subject.classes && subject.classes.length > 0) {
      const Class = (await import("../models/Class.js")).default;
      await Class.updateMany(
        { _id: { $in: subject.classes } },
        { $pull: { subjects: subject._id } }
      );
    }
    
    // Remove subject from teachers
    if (subject.teachers && subject.teachers.length > 0) {
      const Teacher = (await import("../models/Teacher.js")).default;
      await Teacher.updateMany(
        { _id: { $in: subject.teachers } },
        { $pull: { subjects: subject._id } }
      );
    }
    
    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
