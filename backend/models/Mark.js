const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  examType: {
    type: String,
    enum: ['midterm', 'final', 'quiz', 'assignment', 'project'],
    required: true
  },
  examName: {
    type: String,
    required: true
  },
  marksObtained: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number
  },
  grade: {
    type: String
  },
  remarks: {
    type: String
  },
  examDate: {
    type: Date,
    default: Date.now
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  }
}, {
  timestamps: true
});

markSchema.pre('save', function(next) {
  if (this.marksObtained !== undefined && this.totalMarks) {
    this.percentage = (this.marksObtained / this.totalMarks) * 100;
    
    if (this.percentage >= 90) this.grade = 'A+';
    else if (this.percentage >= 80) this.grade = 'A';
    else if (this.percentage >= 70) this.grade = 'B';
    else if (this.percentage >= 60) this.grade = 'C';
    else if (this.percentage >= 50) this.grade = 'D';
    else this.grade = 'F';
  }
  next();
});

markSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.marksObtained !== undefined && update.totalMarks) {
    update.percentage = (update.marksObtained / update.totalMarks) * 100;
    const p = update.percentage;
    if (p >= 90) update.grade = 'A+';
    else if (p >= 80) update.grade = 'A';
    else if (p >= 70) update.grade = 'B';
    else if (p >= 60) update.grade = 'C';
    else if (p >= 50) update.grade = 'D';
    else update.grade = 'F';
  }
  next();
});

module.exports = mongoose.model('Mark', markSchema);
