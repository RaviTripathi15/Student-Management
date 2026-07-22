import mongoose from "mongoose";

const marksSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
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
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment"
    },
    examType: {
      type: String,
      enum: ["Midterm", "Final", "Quiz", "Assignment", "Other"],
      default: "Other"
    },
    obtainedMarks: {
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
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher"
    },
    examDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Calculate percentage before saving
marksSchema.pre("save", function(next) {
  if (this.totalMarks > 0) {
    this.percentage = (this.obtainedMarks / this.totalMarks) * 100;
    
    // Calculate grade based on percentage
    if (this.percentage >= 90) this.grade = "A+";
    else if (this.percentage >= 80) this.grade = "A";
    else if (this.percentage >= 70) this.grade = "B";
    else if (this.percentage >= 60) this.grade = "C";
    else if (this.percentage >= 50) this.grade = "D";
    else this.grade = "F";
  }
  next();
});

// Index for efficient queries
marksSchema.index({ student: 1, subject: 1 });
marksSchema.index({ class: 1, subject: 1 });

const Marks = mongoose.model("Marks", marksSchema);

export default Marks;
