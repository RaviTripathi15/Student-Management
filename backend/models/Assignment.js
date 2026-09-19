<<<<<<< HEAD
import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    assignedDate: {
      type: Date,
      default: Date.now
    },
    totalMarks: {
      type: Number,
      default: 100
    },
    attachments: [{
      type: String
    }],
    status: {
      type: String,
      enum: ["Active", "Closed"],
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
=======
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
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
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  totalMarks: {
    type: Number,
    required: true,
    default: 100
  },
  attachments: [{
    fileName: String,
    fileUrl: String
  }],
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    submittedDate: {
      type: Date,
      default: Date.now
    },
    attachments: [{
      fileName: String,
      fileUrl: String
    }],
    marks: {
      type: Number
    },
    remarks: {
      type: String
    },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'graded'],
      default: 'pending'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Assignment', assignmentSchema);
>>>>>>> f433320e63b0b06420c9a1d7e9143a961f6f97f7
