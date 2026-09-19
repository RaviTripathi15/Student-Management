<<<<<<< HEAD
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
=======
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Mark = require('../models/Mark');
const Student = require('../models/Student');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');

const markAttendance = async (req, res) => {
  try {
    const { studentId, classId, subjectId, date, status, remarks } = req.body;

    // Normalize date to midnight UTC to avoid time-component mismatches
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    const attendance = await Attendance.findOneAndUpdate(
      { student: studentId, date: normalizedDate },
      {
        student: studentId,
        class: classId,
        subject: subjectId,
        date: normalizedDate,
        status,
        markedBy: req.user.profileId,
        remarks
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClassAttendance = async (req, res) => {
  try {
    const { classId, date } = req.query;

    // Normalize date to midnight UTC for consistent querying
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    const attendance = await Attendance.find({ class: classId, date: normalizedDate })
      .populate('student')
      .populate('class')
      .populate('subject');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const attendance = await Attendance.find({ student: studentId })
      .populate('class')
      .populate('subject')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create({
      ...req.body,
      teacher: req.user.profileId
    });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacher: req.user.profileId })
      .populate('subject')
      .populate('class')
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('subject')
      .populate('class')
      .populate('submissions.student');
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { attachments } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const existingSubmission = assignment.submissions.find(
      sub => sub.student.toString() === req.user.profileId.toString()
    );

    if (existingSubmission) {
      existingSubmission.attachments = attachments;
      existingSubmission.submittedDate = Date.now();
      existingSubmission.status = 'submitted';
    } else {
      assignment.submissions.push({
        student: req.user.profileId,
        attachments,
        status: 'submitted'
      });
    }

    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const gradeSubmission = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;
    const { marks, remarks } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submission = assignment.submissions.find(
      sub => sub.student.toString() === studentId
    );

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.marks = marks;
    submission.remarks = remarks;
    submission.status = 'graded';

    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMark = async (req, res) => {
  try {
    const mark = await Mark.create({
      ...req.body,
      markedBy: req.user.profileId
    });
    res.status(201).json(mark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMarks = async (req, res) => {
  try {
    const { subjectId, classId } = req.query;
    const filter = {};
    if (subjectId) filter.subject = subjectId;
    if (classId) filter.class = classId;
    const marks = await Mark.find(filter)
      .populate('student')
      .populate('subject')
      .sort({ examDate: -1 });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentMarks = async (req, res) => {
  try {
    const { studentId } = req.params;
    const marks = await Mark.find({ student: studentId })
      .populate('subject')
      .sort({ examDate: -1 });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMark = async (req, res) => {
  try {
    const mark = await Mark.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mark) {
      return res.status(404).json({ message: 'Mark not found' });
    }
    res.json(mark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMark = async (req, res) => {
  try {
    const mark = await Mark.findByIdAndDelete(req.params.id);
    if (!mark) {
      return res.status(404).json({ message: 'Mark not found' });
    }
    res.json({ message: 'Mark deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAssignedClasses = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.profileId)
      .populate('assignedClasses')
      .populate('assignedSubjects');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }
    res.json({
      classes: teacher.assignedClasses,
      subjects: teacher.assignedSubjects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClassStudents = async (req, res) => {
  try {
    const { classId } = req.params;
    const students = await Student.find({ classId, isActive: true });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  markAttendance,
  getClassAttendance,
  getStudentAttendance,
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission,
  createMark,
  getMarks,
  getStudentMarks,
  updateMark,
  deleteMark,
  getAssignedClasses,
  getClassStudents
};
>>>>>>> f433320e63b0b06420c9a1d7e9143a961f6f97f7
