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
