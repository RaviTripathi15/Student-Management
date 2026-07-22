import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/DashBoard";
import StudentManagement from "../pages/StudentManagement";
import TeacherManagement from "../pages/TeacherManagement";
import ClassManagement from "../pages/ClassManagement";
import SubjectManagement from "../pages/SubjectManagement";
import AttendanceManagement from "../pages/AttendanceManagement";
import AssignmentManagement from "../pages/AssignmentManagement";
import MarksManagement from "../pages/MarksManagement";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<StudentManagement />} />
        <Route path="/teachers" element={<TeacherManagement />} />
        <Route path="/classes" element={<ClassManagement />} />
        <Route path="/subjects" element={<SubjectManagement />} />
        <Route path="/attendance" element={<AttendanceManagement />} />
        <Route path="/assignments" element={<AssignmentManagement />} />
        <Route path="/marks" element={<MarksManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;