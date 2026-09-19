import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../../services/api';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [marksSummary, setMarksSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, attendanceRes, marksRes] = await Promise.all([
        studentAPI.profile.get(),
        studentAPI.attendance.getStats(),
        studentAPI.marks.getSummary()
      ]);
      setProfile(profileRes.data);
      setAttendanceStats(attendanceRes.data);
      setMarksSummary(marksRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Safe date formatter — avoids "Invalid Date" crash
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome, {profile ? `${profile.firstName} ${profile.lastName}` : '...'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium">Attendance</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {attendanceStats?.attendancePercentage ?? 0}%
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Present: {attendanceStats?.present ?? 0} / {attendanceStats?.total ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium">Overall Performance</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {marksSummary?.overallPercentage ?? 0}%
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Total Exams: {marksSummary?.totalExams ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium">Class</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            {profile?.classId?.name || 'Not Assigned'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Roll No: {profile?.rollNumber ?? '—'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium">Status</h3>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            {profile ? (profile.isActive ? 'Active' : 'Inactive') : '—'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Since: {formatDate(profile?.enrollmentDate)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => navigate('/student/profile')} className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition">
            View Profile
          </button>
          <button onClick={() => navigate('/student/attendance')} className="bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition">
            Attendance
          </button>
          <button onClick={() => navigate('/student/assignments')} className="bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition">
            Assignments
          </button>
          <button onClick={() => navigate('/student/marks')} className="bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition">
            Marks
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
