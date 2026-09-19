import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats?.students ?? 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Teachers</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats?.teachers ?? 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Classes</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats?.classes ?? 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Subjects</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">{stats?.subjects ?? 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => navigate('/admin/students')} className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition">
            Manage Students
          </button>
          <button onClick={() => navigate('/admin/teachers')} className="bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition">
            Manage Teachers
          </button>
          <button onClick={() => navigate('/admin/classes')} className="bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition">
            Manage Classes
          </button>
          <button onClick={() => navigate('/admin/subjects')} className="bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition">
            Manage Subjects
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
