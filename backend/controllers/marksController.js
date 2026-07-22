import Marks from "../models/Marks.js";

// @desc    Get all marks
// @route   GET /api/marks
// @access  Private (Admin, Teacher)
export const getAllMarks = async (req, res) => {
  try {
    const { student, subject, class: classId, examType } = req.query;
    
    const filter = {};
    if (student) filter.student = student;
    if (subject) filter.subject = subject;
    if (classId) filter.class = classId;
    if (examType) filter.examType = examType;
    
    const marks = await Marks.find(filter)
      .populate("student", "rollNumber")
      .populate("subject", "name code")
      .populate("class", "name grade section")
      .populate("assignment", "title")
      .populate("markedBy", "name employeeId")
      .sort({ examDate: -1 });
    
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get marks by student
// @route   GET /api/marks/student/:studentId
// @access  Private (Admin, Teacher, Student - own marks)
export const getMarksByStudent = async (req, res) => {
  try {
    const marks = await Marks.find({ student: req.params.studentId })
      .populate("subject", "name code totalMarks passMarks")
      .populate("class", "name grade section")
      .populate("assignment", "title dueDate")
      .sort({ examDate: -1 });
    
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get marks by subject
// @route   GET /api/marks/subject/:subjectId
// @access  Private (Admin, Teacher)
export const getMarksBySubject = async (req, res) => {
  try {
    const marks = await Marks.find({ subject: req.params.subjectId })
      .populate("student", "rollNumber")
      .populate("class", "name grade section")
      .sort({ obtainedMarks: -1 });
    
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get marks by class
// @route   GET /api/marks/class/:classId
// @access  Private (Admin, Teacher)
export const getMarksByClass = async (req, res) => {
  try {
    const { subject, examType } = req.query;
    
    const filter = { class: req.params.classId };
    if (subject) filter.subject = subject;
    if (examType) filter.examType = examType;
    
    const marks = await Marks.find(filter)
      .populate("student", "rollNumber")
      .populate("subject", "name code")
      .sort({ obtainedMarks: -1 });
    
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create new marks
// @route   POST /api/marks
// @access  Private (Admin, Teacher)
export const createMarks = async (req, res) => {
  try {
    const marksData = {
      ...req.body,
      markedBy: req.user._id
    };
    
    // Check if marks already exist for this student, subject, and exam
    const existingMarks = await Marks.findOne({
      student: req.body.student,
      subject: req.body.subject,
      examType: req.body.examType,
      assignment: req.body.assignment
    });
    
    if (existingMarks) {
      return res.status(400).json({ 
        message: "Marks already exist for this student, subject, and exam type" 
      });
    }
    
    const marks = await Marks.create(marksData);
    
    const populatedMarks = await Marks.findById(marks._id)
      .populate("student", "rollNumber")
      .populate("subject", "name code");
    
    res.status(201).json(populatedMarks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Bulk create marks for a class
// @route   POST /api/marks/bulk
// @access  Private (Admin, Teacher)
export const bulkCreateMarks = async (req, res) => {
  try {
    const { class: classId, subject, examType, assignment, marksRecords } = req.body;
    
    const bulkOperations = marksRecords.map(record => ({
      updateOne: {
        filter: {
          student: record.student,
          subject,
          examType,
          assignment
        },
        update: {
          $set: {
            class: classId,
            obtainedMarks: record.obtainedMarks,
            totalMarks: record.totalMarks,
            remarks: record.remarks,
            markedBy: req.user._id,
            examDate: new Date()
          }
        },
        upsert: true
      }
    }));
    
    await Marks.bulkWrite(bulkOperations);
    
    res.json({ message: "Bulk marks created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update marks
// @route   PUT /api/marks/:id
// @access  Private (Admin, Teacher)
export const updateMarks = async (req, res) => {
  try {
    const marks = await Marks.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!marks) {
      return res.status(404).json({ message: "Marks not found" });
    }
    
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete marks
// @route   DELETE /api/marks/:id
// @access  Private (Admin)
export const deleteMarks = async (req, res) => {
  try {
    const marks = await Marks.findByIdAndDelete(req.params.id);
    
    if (!marks) {
      return res.status(404).json({ message: "Marks not found" });
    }
    
    res.json({ message: "Marks deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get student performance report
// @route   GET /api/marks/report/:studentId
// @access  Private (Admin, Teacher, Student - own report)
export const getStudentReport = async (req, res) => {
  try {
    const marks = await Marks.find({ student: req.params.studentId })
      .populate("subject", "name code totalMarks passMarks")
      .sort({ examDate: -1 });
    
    // Calculate overall statistics
    const totalMarks = marks.reduce((sum, mark) => sum + mark.totalMarks, 0);
    const totalObtained = marks.reduce((sum, mark) => sum + mark.obtainedMarks, 0);
    const overallPercentage = totalMarks > 0 ? (totalObtained / totalMarks) * 100 : 0;
    
    // Group by subject
    const subjectStats = {};
    marks.forEach(mark => {
      const subjectName = mark.subject.name;
      if (!subjectStats[subjectName]) {
        subjectStats[subjectName] = {
          totalMarks: 0,
          obtainedMarks: 0,
          count: 0
        };
      }
      subjectStats[subjectName].totalMarks += mark.totalMarks;
      subjectStats[subjectName].obtainedMarks += mark.obtainedMarks;
      subjectStats[subjectName].count += 1;
    });
    
    // Calculate subject-wise percentages
    Object.keys(subjectStats).forEach(subject => {
      subjectStats[subject].percentage = 
        (subjectStats[subject].obtainedMarks / subjectStats[subject].totalMarks) * 100;
    });
    
    res.json({
      overall: {
        totalMarks,
        totalObtained,
        percentage: overallPercentage.toFixed(2),
        grade: overallPercentage >= 90 ? "A+" : 
               overallPercentage >= 80 ? "A" : 
               overallPercentage >= 70 ? "B" : 
               overallPercentage >= 60 ? "C" : 
               overallPercentage >= 50 ? "D" : "F"
      },
      subjectWise: subjectStats,
      detailedMarks: marks
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
