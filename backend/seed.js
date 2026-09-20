const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const Class = require('./models/Class');
const Subject = require('./models/Subject');
const Assignment = require('./models/Assignment');
const Attendance = require('./models/Attendance');
const Mark = require('./models/Mark');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('Seeding initial data...');

    // Clear existing collections if desired
    await User.deleteMany({});
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Class.deleteMany({});
    await Subject.deleteMany({});
    await Assignment.deleteMany({});
    await Attendance.deleteMany({});
    await Mark.deleteMany({});

    console.log('Previous data cleared.');

    // 1. Create Class
    const newClass = await Class.create({
      name: 'Class 10-A',
      grade: '10',
      section: 'A',
      capacity: 40
    });

    // 2. Create Teacher Profile & Account
    const teacherProfile = await Teacher.create({
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'teacher@sms.com',
      employeeId: 'TCH-1001',
      phone: '+1 555-0199',
      qualification: 'M.Sc. Mathematics, B.Ed',
      assignedClasses: [newClass._id],
      isActive: true
    });

    const teacherUser = await User.create({
      name: 'Sarah Johnson',
      email: 'teacher@sms.com',
      password: 'teacher123',
      role: 'teacher',
      profileModel: 'Teacher',
      profileId: teacherProfile._id
    });

    // 3. Create Subject
    const mathSubject = await Subject.create({
      name: 'Mathematics',
      code: 'MATH-101',
      description: 'Advanced High School Algebra and Geometry',
      credits: 4,
      teacher: teacherProfile._id
    });

    const scienceSubject = await Subject.create({
      name: 'Physical Sciences',
      code: 'SCI-101',
      description: 'Physics and Chemistry fundamentals',
      credits: 4,
      teacher: teacherProfile._id
    });

    // Link subjects to teacher & class
    teacherProfile.assignedSubjects = [mathSubject._id, scienceSubject._id];
    await teacherProfile.save();

    newClass.classTeacher = teacherProfile._id;
    newClass.subjects = [mathSubject._id, scienceSubject._id];
    await newClass.save();

    // 4. Create Student Profile & Account
    const studentProfile = await Student.create({
      firstName: 'Alex',
      lastName: 'Rivers',
      email: 'student@sms.com',
      dateOfBirth: new Date('2008-05-15'),
      gender: 'male',
      address: '742 Evergreen Terrace, Springfield',
      phone: '+1 555-0142',
      classId: newClass._id,
      rollNumber: 'STU-1001',
      parentName: 'Robert Rivers',
      parentPhone: '+1 555-0143',
      isActive: true
    });

    const studentUser = await User.create({
      name: 'Alex Rivers',
      email: 'student@sms.com',
      password: 'student123',
      role: 'student',
      profileModel: 'Student',
      profileId: studentProfile._id
    });

    // Add student to class
    newClass.students = [studentProfile._id];
    await newClass.save();

    // 5. Create Admin Account
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@sms.com',
      password: 'admin123',
      role: 'admin'
    });

    // 6. Create Sample Attendance
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    await Attendance.create([
      {
        student: studentProfile._id,
        class: newClass._id,
        subject: mathSubject._id,
        date: yesterday,
        status: 'present',
        markedBy: teacherProfile._id,
        remarks: 'Active participation'
      },
      {
        student: studentProfile._id,
        class: newClass._id,
        subject: mathSubject._id,
        date: today,
        status: 'present',
        markedBy: teacherProfile._id,
        remarks: 'On time'
      }
    ]);

    // 7. Create Sample Assignment
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    await Assignment.create({
      title: 'Trigonometry Problem Set #1',
      description: 'Solve problems 1-15 on Chapter 4. Show all working clearly.',
      subject: mathSubject._id,
      class: newClass._id,
      teacher: teacherProfile._id,
      dueDate: dueDate,
      totalMarks: 50,
      submissions: [
        {
          student: studentProfile._id,
          submittedDate: new Date(),
          attachments: [{ fileName: 'alex_trig_homework.pdf', fileUrl: '#' }],
          status: 'submitted'
        }
      ]
    });

    // 8. Create Sample Marks
    await Mark.create([
      {
        student: studentProfile._id,
        subject: mathSubject._id,
        class: newClass._id,
        examType: 'midterm',
        examName: 'Mid-Term Exam',
        marksObtained: 88,
        totalMarks: 100,
        remarks: 'Excellent analytical skills',
        markedBy: teacherProfile._id
      },
      {
        student: studentProfile._id,
        subject: scienceSubject._id,
        class: newClass._id,
        examType: 'quiz',
        examName: 'Newtonian Physics Quiz',
        marksObtained: 45,
        totalMarks: 50,
        remarks: 'Great understanding of concepts',
        markedBy: teacherProfile._id
      }
    ]);

    console.log('✅ Seeding completed successfully!');
    console.log('-------------------------------------------');
    console.log('Default Credentials:');
    console.log('Admin:   email: admin@sms.com   | password: admin123');
    console.log('Teacher: email: teacher@sms.com | password: teacher123');
    console.log('Student: email: student@sms.com | password: student123');
    console.log('-------------------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seedData();
