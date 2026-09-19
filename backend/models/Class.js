<<<<<<< HEAD
import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    grade: {
      type: String,
      required: true
    },
    section: {
      type: String,
      required: true
    },
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher"
    },
    subjects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject"
    }],
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    }],
    capacity: {
      type: Number,
      default: 40
    },
    roomNumber: {
      type: String
    },
    academicYear: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

const Class = mongoose.model("Class", classSchema);

export default Class;
=======
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  grade: {
    type: Number,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  maxCapacity: {
    type: Number,
    default: 40
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Class', classSchema);
>>>>>>> f433320e63b0b06420c9a1d7e9143a961f6f97f7
