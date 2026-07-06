import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherAPI } from '../../services/api';

const TeacherDashboard = () => {
  const [assignedData, setAssignedData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignedData();
  }, []);

  const fetchAssignedData = async () => {
    try {
      const response = await teacherAPI.getAssigned();
      setAssignedData(response.data);
    } catch (error) {
      console.error('Error fetching assigned data:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-4">Assigned Classes</h3>
          <div className="space-y-2">
            {assignedData?.classes?.length > 0 ? (
              assignedData.classes.map((cls) => (
                <div key={cls._id} className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium">{cls.name}</p>
                  <p className="text-sm text-gray-600">Grade: {cls.grade} — Section: {cls.section}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No classes assigned yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-4">Assigned Subjects</h3>
          <div className="space-y-2">
            {assignedData?.subjects?.length > 0 ? (
              assignedData.subjects.map((subject) => (
                <div key={subject._id} className="bg-green-50 p-3 rounded-lg">
                  <p className="font-medium">{subject.name}</p>
                  <p className="text-sm text-gray-600">Code: {subject.code}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No subjects assigned yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button onClick={() => navigate('/teacher/attendance')} className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition">
            Mark Attendance
          </button>
          <button onClick={() => navigate('/teacher/assignments')} className="bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition">
            Assignments
          </button>
          <button onClick={() => navigate('/teacher/marks')} className="bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition">
            Upload Marks
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
