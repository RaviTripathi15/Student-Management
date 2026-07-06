import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Unauthorized from './pages/Unauthorized';
import AdminDashboard from './pages/Admin/Dashboard';
import Students from './pages/Admin/Students';
import Teachers from './pages/Admin/Teachers';
import Classes from './pages/Admin/Classes';
import Subjects from './pages/Admin/Subjects';
import TeacherDashboard from './pages/Teacher/Dashboard';
import TeacherAttendance from './pages/Teacher/Attendance';
import TeacherAssignments from './pages/Teacher/Assignments';
import TeacherMarks from './pages/Teacher/Marks';
import StudentDashboard from './pages/Student/Dashboard';
import StudentProfile from './pages/Student/Profile';
import StudentAttendance from './pages/Student/Attendance';
import StudentAssignments from './pages/Student/Assignments';
import StudentMarks from './pages/Student/Marks';
import AdminLayout from './components/AdminLayout';
import TeacherLayout from './components/TeacherLayout';
import StudentLayout from './components/StudentLayout';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin routes — wrapped in AdminLayout for persistent navbar */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/students" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><Students /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/teachers" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><Teachers /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/classes" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><Classes /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/subjects" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><Subjects /></AdminLayout>
            </ProtectedRoute>
          } />

          {/* Teacher routes — wrapped in TeacherLayout */}
          <Route path="/teacher" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherLayout><TeacherDashboard /></TeacherLayout>
            </ProtectedRoute>
          } />
          <Route path="/teacher/attendance" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherLayout><TeacherAttendance /></TeacherLayout>
            </ProtectedRoute>
          } />
          <Route path="/teacher/assignments" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherLayout><TeacherAssignments /></TeacherLayout>
            </ProtectedRoute>
          } />
          <Route path="/teacher/marks" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherLayout><TeacherMarks /></TeacherLayout>
            </ProtectedRoute>
          } />

          {/* Student routes — wrapped in StudentLayout */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout><StudentDashboard /></StudentLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/profile" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout><StudentProfile /></StudentLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/attendance" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout><StudentAttendance /></StudentLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/assignments" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout><StudentAssignments /></StudentLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/marks" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout><StudentMarks /></StudentLayout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
