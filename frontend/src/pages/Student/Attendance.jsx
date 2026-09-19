import { useEffect, useState } from 'react';
import { studentAPI } from '../../services/api';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [attendanceRes, statsRes] = await Promise.all([
        studentAPI.attendance.get(),
        studentAPI.attendance.getStats()
      ]);
      setAttendance(attendanceRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance Record</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-gray-500 text-sm">Total Days</h3>
          <p className="text-2xl font-bold text-gray-800">{stats?.total || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-gray-500 text-sm">Present</h3>
          <p className="text-2xl font-bold text-green-600">{stats?.present || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-gray-500 text-sm">Absent</h3>
          <p className="text-2xl font-bold text-red-600">{stats?.absent || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-gray-500 text-sm">Percentage</h3>
          <p className="text-2xl font-bold text-blue-600">{stats?.attendancePercentage || 0}%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendance.map((record) => (
              <tr key={record._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{record.class?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{record.subject?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    record.status === 'present' ? 'bg-green-100 text-green-800' :
                    record.status === 'absent' ? 'bg-red-100 text-red-800' :
                    record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{record.remarks || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
