<<<<<<< HEAD
import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    employeeId: {
      type: String,
      required: true,
      unique: true
    },
    department: {
      type: String
    },
    subjects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject"
    }],
    classes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class"
    }],
    qualification: {
      type: String
    },
    experience: {
      type: Number,
      default: 0
    },
    phone: {
      type: String
    },
    address: {
      type: String
    },
    hireDate: {
      type: Date,
      default: Date.now
    },
    salary: {
      type: Number
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

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
=======
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
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
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
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
  joiningDate: {
    type: Date,
    default: Date.now
  },
  assignedClasses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  assignedSubjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Teacher', teacherSchema);
>>>>>>> f433320e63b0b06420c9a1d7e9143a961f6f97f7
