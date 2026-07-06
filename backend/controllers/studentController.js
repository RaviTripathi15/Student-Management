const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Mark = require('../models/Mark');

const getProfile = async (req, res) => {
  try {
    // profileId is null if admin hasn't created a profile for this user yet
    if (!req.user.profileId) {
      return res.status(404).json({
        message: 'Profile not set up yet',
        reason: 'NO_PROFILE',
        hint: 'Ask your administrator to create your student profile and link it to your account.'
      });
    }

    const student = await Student.findById(req.user.profileId).populate('classId');
    if (!student) {
      return res.status(404).json({
        message: 'Student profile not found',
        reason: 'NO_PROFILE',
        hint: 'Ask your administrator to create your student profile and link it to your account.'
      });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    if (!req.user.profileId) {
      return res.status(404).json({ message: 'No profile linked to this account' });
    }

    // Only allow safe fields to be updated by student themselves
    const allowed = ['firstName', 'lastName', 'phone', 'address', 'photo'];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    const student = await Student.findByIdAndUpdate(
      req.user.profileId,
      updates,
      { new: true, runValidators: true }
    ).populate('classId');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.user.profileId })
      .populate('class')
      .populate('subject')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAttendanceStats = async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.user.profileId });
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const excused = attendance.filter(a => a.status === 'excused').length;
    const total = attendance.length;

    res.json({
      present,
      absent,
      late,
      excused,
      total,
      attendancePercentage: total > 0 ? ((present / total) * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAssignments = async (req, res) => {
  try {
    const student = await Student.findById(req.user.profileId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (!student.classId) {
      return res.json([]);
    }
    const assignments = await Assignment.find({ class: student.classId, isActive: true })
      .populate('subject')
      .populate('teacher')
      .sort({ dueDate: 1 });
    
    const assignmentsWithStatus = assignments.map(assignment => {
      const submission = assignment.submissions.find(
        sub => sub.student.toString() === req.user.profileId.toString()
      );
      return {
        ...assignment.toObject(),
        submissionStatus: submission ? submission.status : 'pending',
        submittedDate: submission ? submission.submittedDate : null,
        marks: submission ? submission.marks : null
      };
    });

    res.json(assignmentsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('subject')
      .populate('teacher');
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submission = assignment.submissions.find(
      sub => sub.student.toString() === req.user.profileId.toString()
    );

    res.json({
      ...assignment.toObject(),
      submission: submission || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMarks = async (req, res) => {
  try {
    const marks = await Mark.find({ student: req.user.profileId })
      .populate('subject')
      .sort({ examDate: -1 });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMarksSummary = async (req, res) => {
  try {
    const marks = await Mark.find({ student: req.user.profileId }).populate('subject');
    
    const subjectWise = {};
    marks.forEach(mark => {
      const subjectName = mark.subject.name;
      if (!subjectWise[subjectName]) {
        subjectWise[subjectName] = {
          totalObtained: 0,
          totalMarks: 0,
          count: 0
        };
      }
      subjectWise[subjectName].totalObtained += mark.marksObtained;
      subjectWise[subjectName].totalMarks += mark.totalMarks;
      subjectWise[subjectName].count += 1;
    });

    const summary = Object.keys(subjectWise).map(subject => ({
      subject,
      averagePercentage: ((subjectWise[subject].totalObtained / subjectWise[subject].totalMarks) * 100).toFixed(2),
      totalExams: subjectWise[subject].count
    }));

    const overallPercentage = marks.length > 0 
      ? ((marks.reduce((sum, m) => sum + m.marksObtained, 0) / marks.reduce((sum, m) => sum + m.totalMarks, 0)) * 100).toFixed(2)
      : 0;

    res.json({
      summary,
      overallPercentage,
      totalExams: marks.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAttendance,
  getAttendanceStats,
  getAssignments,
  getAssignmentById,
  getMarks,
  getMarksSummary
};
