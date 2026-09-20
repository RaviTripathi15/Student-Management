const Attendance = require('../models/Attendance');

const markAttendance = async (req, res) => {
  try {
    const { student, class: classId, subject, date, status, remarks } = req.body;
    const normalizedDate = new Date(date || Date.now());
    normalizedDate.setUTCHours(0, 0, 0, 0);

    const record = await Attendance.findOneAndUpdate(
      { student, date: normalizedDate },
      {
        student,
        class: classId,
        subject,
        date: normalizedDate,
        status,
        remarks,
        markedBy: req.user?._id
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAttendanceByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { date } = req.query;
    const filter = { class: classId };
    
    if (date) {
      const normalizedDate = new Date(date);
      normalizedDate.setUTCHours(0, 0, 0, 0);
      filter.date = normalizedDate;
    }

    const records = await Attendance.find(filter)
      .populate('student')
      .populate('subject');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAttendanceByStudent = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.params.studentId })
      .populate('class')
      .populate('subject')
      .sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  markAttendance,
  getAttendanceByClass,
  getAttendanceByStudent
};
