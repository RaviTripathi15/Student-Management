import Attendance from "../models/Attendance.js";

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private (Admin, Teacher)
export const getAllAttendance = async (req, res) => {
  try {
    const { date, class: classId, subject, student } = req.query;
    
    const filter = {};
    if (date) filter.date = new Date(date);
    if (classId) filter.class = classId;
    if (subject) filter.subject = subject;
    if (student) filter.student = student;
    
    const attendance = await Attendance.find(filter)
      .populate("student", "rollNumber")
      .populate("class", "name grade section")
      .populate("subject", "name code")
      .populate("markedBy", "name employeeId")
      .sort({ date: -1 });
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get attendance by student
// @route   GET /api/attendance/student/:studentId
// @access  Private (Admin, Teacher, Student - own records)
export const getAttendanceByStudent = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = { student: req.params.studentId };
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const attendance = await Attendance.find(filter)
      .populate("class", "name grade section")
      .populate("subject", "name code")
      .sort({ date: -1 });
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get attendance by class and date
// @route   GET /api/attendance/class/:classId/date/:date
// @access  Private (Admin, Teacher)
export const getAttendanceByClassAndDate = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      class: req.params.classId,
      date: new Date(req.params.date)
    })
      .populate("student", "rollNumber")
      .populate("subject", "name code");
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private (Admin, Teacher)
export const markAttendance = async (req, res) => {
  try {
    const { student, class: classId, subject, date, status, remarks } = req.body;
    
    // Check if attendance already exists for this student on this date
    const existingAttendance = await Attendance.findOne({
      student,
      class: classId,
      date: new Date(date)
    });
    
    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      existingAttendance.subject = subject;
      existingAttendance.remarks = remarks;
      existingAttendance.markedBy = req.user._id;
      await existingAttendance.save();
      return res.json(existingAttendance);
    }
    
    // Create new attendance record
    const attendance = await Attendance.create({
      student,
      class: classId,
      subject,
      date: new Date(date),
      status,
      remarks,
      markedBy: req.user._id
    });
    
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Mark bulk attendance for a class
// @route   POST /api/attendance/bulk
// @access  Private (Admin, Teacher)
export const markBulkAttendance = async (req, res) => {
  try {
    const { class: classId, subject, date, attendanceRecords } = req.body;
    
    const bulkOperations = attendanceRecords.map(record => ({
      updateOne: {
        filter: {
          student: record.student,
          class: classId,
          date: new Date(date)
        },
        update: {
          $set: {
            status: record.status,
            subject,
            remarks: record.remarks,
            markedBy: req.user._id
          }
        },
        upsert: true
      }
    }));
    
    await Attendance.bulkWrite(bulkOperations);
    
    res.json({ message: "Bulk attendance marked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update attendance
// @route   PUT /api/attendance/:id
// @access  Private (Admin, Teacher)
export const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete attendance
// @route   DELETE /api/attendance/:id
// @access  Private (Admin)
export const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    
    res.json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get attendance statistics
// @route   GET /api/attendance/stats/:studentId
// @access  Private (Admin, Teacher, Student - own stats)
export const getAttendanceStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = { student: req.params.studentId };
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const attendance = await Attendance.find(filter);
    
    const stats = {
      total: attendance.length,
      present: attendance.filter(a => a.status === "Present").length,
      absent: attendance.filter(a => a.status === "Absent").length,
      late: attendance.filter(a => a.status === "Late").length,
      excused: attendance.filter(a => a.status === "Excused").length,
      percentage: 0
    };
    
    if (stats.total > 0) {
      stats.percentage = ((stats.present / stats.total) * 100).toFixed(2);
    }
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
