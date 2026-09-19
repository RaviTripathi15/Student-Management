<<<<<<< HEAD
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject"
    },
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late", "Excused"],
      required: true
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher"
    },
    remarks: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
attendanceSchema.index({ student: 1, date: 1 });
attendanceSchema.index({ class: 1, date: 1 });

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
=======
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    required: true
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
>>>>>>> f433320e63b0b06420c9a1d7e9143a961f6f97f7
