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
