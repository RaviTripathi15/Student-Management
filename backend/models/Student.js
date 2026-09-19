<<<<<<< HEAD
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class"
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"]
    },
    address: {
      type: String
    },
    phone: {
      type: String
    },
    parentName: {
      type: String
    },
    parentPhone: {
      type: String
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Graduated"],
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
=======
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true  // allows null/undefined but enforces unique when present
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  parentName: {
    type: String,
    required: true
  },
  parentPhone: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  photo: {
    type: String,   // stores base64 data URL  e.g. "data:image/jpeg;base64,..."
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
>>>>>>> f433320e63b0b06420c9a1d7e9143a961f6f97f7
