const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const User = require('../models/User');
const createStudent = async (req, res) => {
  try {
    // Check if a user account exists with this email to link profileId
    const student = await Student.create(req.body);

    // If an email was provided, link the student profile to the User account
    if (req.body.email) {
      await User.findOneAndUpdate(
        { email: req.body.email.toLowerCase(), role: 'student' },
        { profileId: student._id, profileModel: 'Student' }
      );
    }

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('classId')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('classId');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);

    // Link teacher profile to existing User account with same email
    if (req.body.email) {
      await User.findOneAndUpdate(
        { email: req.body.email.toLowerCase(), role: 'teacher' },
        { profileId: teacher._id, profileModel: 'Teacher' }
      );
    }

    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate('assignedClasses assignedSubjects')
      .sort({ createdAt: -1 });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('assignedClasses assignedSubjects');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createClass = async (req, res) => {
  try {
    const classData = await Class.create(req.body);
    res.status(201).json(classData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('classTeacher subjects students')
      .sort({ createdAt: -1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate('classTeacher subjects students');
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(classData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(classData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndDelete(req.params.id);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate('teacher').sort({ createdAt: -1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('teacher');
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const studentCount = await Student.countDocuments({ isActive: true });
    const teacherCount = await Teacher.countDocuments({ isActive: true });
    const classCount = await Class.countDocuments({ isActive: true });
    const subjectCount = await Subject.countDocuments({ isActive: true });

    res.json({
      students: studentCount,
      teachers: teacherCount,
      classes: classCount,
      subjects: subjectCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Link an existing User account to a Student or Teacher profile
const linkUserToProfile = async (req, res) => {
  try {
    const { userId, profileId, profileModel } = req.body;

    if (!['Student', 'Teacher'].includes(profileModel)) {
      return res.status(400).json({ message: 'profileModel must be Student or Teacher' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profileId, profileModel },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User linked successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (for admin management)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  getDashboardStats,
  linkUserToProfile,
  getUsers
};
