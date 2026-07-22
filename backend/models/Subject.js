import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String
    },
    classes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class"
    }],
    teachers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher"
    }],
    credits: {
      type: Number,
      default: 1
    },
    totalMarks: {
      type: Number,
      default: 100
    },
    passMarks: {
      type: Number,
      default: 40
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

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
