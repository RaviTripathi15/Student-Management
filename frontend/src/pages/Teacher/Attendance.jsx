import { useEffect, useState } from 'react';
import { teacherAPI } from '../../services/api';

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  // students = full student list for the class
  const [students, setStudents] = useState([]);
  // attendanceMap = { studentId: 'present'|'absent'|'late'|'excused' }
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchAssignedClasses();
  }, []);

  const fetchAssignedClasses = async () => {
    try {
      const response = await teacherAPI.getAssigned();
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  // Load students for the class, then overlay any existing attendance for the date
  const handleLoadStudents = async () => {
    if (!selectedClass) return;
    setLoading(true);
    setLoaded(false);
    setStudents([]);
    setAttendanceMap({});
    try {
      const [studentsRes, attendanceRes] = await Promise.all([
        teacherAPI.getClassStudents(selectedClass),
        teacherAPI.attendance.getClass({ classId: selectedClass, date })
      ]);

      setStudents(studentsRes.data);

      // Build a map of existing attendance: { studentId -> status }
      const map = {};
      attendanceRes.data.forEach((record) => {
        if (record.student?._id) {
          map[record.student._id] = record.status;
        }
      });
      setAttendanceMap(map);
      setLoaded(true);
    } catch (error) {
      console.error('Error loading attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (studentId, status) => {
    // Optimistic UI update
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
    setSaving((prev) => ({ ...prev, [studentId]: true }));
    try {
      await teacherAPI.attendance.mark({
        studentId,
        classId: selectedClass,
        date,
        status
      });
    } catch (error) {
      console.error('Error marking attendance:', error);
      // Revert on failure
      setAttendanceMap((prev) => ({ ...prev, [studentId]: undefined }));
    } finally {
      setSaving((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  const statusColor = (status) => {
    if (status === 'present') return 'bg-green-100 text-green-800';
    if (status === 'absent')  return 'bg-red-100 text-red-800';
    if (status === 'late')    return 'bg-yellow-100 text-yellow-800';
    if (status === 'excused') return 'bg-gray-100 text-gray-800';
    return 'bg-gray-50 text-gray-400';
  };

  const presentCount = Object.values(attendanceMap).filter(s => s === 'present').length;
  const markedCount  = Object.keys(attendanceMap).length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mark Attendance</h1>

      {/* Filter bar */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => { setSelectedClass(e.target.value); setLoaded(false); setStudents([]); setAttendanceMap({}); }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Select a class --</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} (Grade {cls.grade} - {cls.section})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); setLoaded(false); setStudents([]); setAttendanceMap({}); }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleLoadStudents}
              disabled={!selectedClass || loading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load Students'}
            </button>
          </div>
        </div>
      </div>

      {/* Summary bar */}
      {loaded && students.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-gray-500 text-sm">Total Students</p>
            <p className="text-2xl font-bold text-gray-800">{students.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-gray-500 text-sm">Marked</p>
            <p className="text-2xl font-bold text-blue-600">{markedCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-gray-500 text-sm">Present</p>
            <p className="text-2xl font-bold text-green-600">{presentCount}</p>
          </div>
        </div>
      )}

      {/* Student list with attendance buttons */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          Loading students...
        </div>
      ) : loaded && students.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          No students found in this class. Ask admin to assign students.
        </div>
      ) : loaded ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mark As</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student, idx) => {
                const currentStatus = attendanceMap[student._id];
                const isSaving = saving[student._id];
                return (
                  <tr key={student._id} className={isSaving ? 'opacity-60' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.rollNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(currentStatus)}`}>
                        {currentStatus || 'Not marked'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {['present', 'absent', 'late', 'excused'].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleMarkAttendance(student._id, s)}
                            disabled={isSaving}
                            className={`px-2 py-1 rounded text-xs capitalize font-medium transition ${
                              currentStatus === s
                                ? s === 'present' ? 'bg-green-600 text-white ring-2 ring-green-400'
                                : s === 'absent'  ? 'bg-red-600 text-white ring-2 ring-red-400'
                                : s === 'late'    ? 'bg-yellow-600 text-white ring-2 ring-yellow-400'
                                : 'bg-gray-600 text-white ring-2 ring-gray-400'
                                : s === 'present' ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : s === 'absent'  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                : s === 'late'    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          Select a class and date, then click "Load Students"
        </div>
      )}
    </div>
  );
};

export default Attendance;
