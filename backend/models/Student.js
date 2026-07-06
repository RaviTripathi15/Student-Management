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
