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
