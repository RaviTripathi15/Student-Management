import { useEffect, useState } from 'react';
import { teacherAPI } from '../../services/api';

const Marks = () => {
  const [marks, setMarks] = useState([]);
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [classStudents, setClassStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    student: '',
    subject: '',
    class: '',
    examType: 'midterm',
    examName: '',
    marksObtained: '',
    totalMarks: ''
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [marksRes, assignedRes] = await Promise.all([
        teacherAPI.marks.getAll(),
        teacherAPI.getAssigned()
      ]);
      setMarks(marksRes.data);
      setAssignedSubjects(assignedRes.data.subjects || []);
      setAssignedClasses(assignedRes.data.classes || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // When teacher selects a class, load its students
  const handleClassChange = async (classId) => {
    setFormData((prev) => ({ ...prev, class: classId, student: '' }));
    setClassStudents([]);
    if (!classId) return;
    setStudentsLoading(true);
    try {
      const res = await teacherAPI.getClassStudents(classId);
      setClassStudents(res.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.class)   { setFormError('Please select a class.');   return; }
    if (!formData.subject) { setFormError('Please select a subject.');  return; }
    if (!formData.student) { setFormError('Please select a student.');  return; }

    const obtained = parseFloat(formData.marksObtained);
    const total    = parseFloat(formData.totalMarks);

    if (obtained > total) {
      setFormError('Marks obtained cannot exceed total marks.');
      return;
    }

    try {
      await teacherAPI.marks.create({
        ...formData,
        marksObtained: obtained,
        totalMarks: total
      });
      setShowForm(false);
      setFormData({
        student: '',
        subject: '',
        class: '',
        examType: 'midterm',
        examName: '',
        marksObtained: '',
        totalMarks: ''
      });
      setClassStudents([]);
      fetchAll();
    } catch (error) {
      console.error('Error creating marks:', error);
      setFormError(error.response?.data?.message || 'Failed to save marks.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await teacherAPI.marks.delete(id);
        fetchAll();
      } catch (error) {
        console.error('Error deleting marks:', error);
      }
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Marks Management</h1>
        <button
          onClick={() => { setShowForm(!showForm); setFormError(''); }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Add Marks'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Marks</h2>

          {formError && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{formError}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Step 1: Select Class → loads students */}
              <div>
                <label className="block text-gray-700 mb-2">Class</label>
                <select
                  value={formData.class}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">-- Select Class --</option>
                  {assignedClasses.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name} (Grade {cls.grade} - {cls.section})
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Select Subject */}
              <div>
                <label className="block text-gray-700 mb-2">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">-- Select Subject --</option>
                  {assignedSubjects.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name} ({sub.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3: Select Student (loads after class is chosen) */}
              <div>
                <label className="block text-gray-700 mb-2">Student</label>
                <select
                  value={formData.student}
                  onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  disabled={!formData.class || studentsLoading}
                >
                  <option value="">
                    {!formData.class
                      ? '-- Select a class first --'
                      : studentsLoading
                      ? 'Loading students...'
                      : classStudents.length === 0
                      ? 'No students in this class'
                      : '-- Select Student --'}
                  </option>
                  {classStudents.map((stu) => (
                    <option key={stu._id} value={stu._id}>
                      {stu.firstName} {stu.lastName} ({stu.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              {/* Exam Type */}
              <div>
                <label className="block text-gray-700 mb-2">Exam Type</label>
                <select
                  value={formData.examType}
                  onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="midterm">Midterm</option>
                  <option value="final">Final</option>
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
                  <option value="project">Project</option>
                </select>
              </div>

              {/* Exam Name */}
              <div>
                <label className="block text-gray-700 mb-2">Exam Name</label>
                <input
                  type="text"
                  value={formData.examName}
                  onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                  placeholder="e.g. Mid-Term Oct 2024"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* Marks Obtained */}
              <div>
                <label className="block text-gray-700 mb-2">Marks Obtained</label>
                <input
                  type="number"
                  value={formData.marksObtained}
                  onChange={(e) => setFormData({ ...formData, marksObtained: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  min="0"
                  required
                />
              </div>

              {/* Total Marks */}
              <div>
                <label className="block text-gray-700 mb-2">Total Marks</label>
                <input
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  min="1"
                  required
                />
              </div>

            </div>

            {/* Live percentage preview */}
            {formData.marksObtained && formData.totalMarks && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                Preview: {((parseFloat(formData.marksObtained) / parseFloat(formData.totalMarks)) * 100).toFixed(1)}%
                {' — '}
                Grade:{' '}
                {(() => {
                  const p = (parseFloat(formData.marksObtained) / parseFloat(formData.totalMarks)) * 100;
                  if (p >= 90) return 'A+';
                  if (p >= 80) return 'A';
                  if (p >= 70) return 'B';
                  if (p >= 60) return 'C';
                  if (p >= 50) return 'D';
                  return 'F';
                })()}
              </div>
            )}

            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Save Marks
            </button>
          </form>
        </div>
      )}

      {/* Marks Table */}
      {marks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          No marks recorded yet. Click "Add Marks" to get started.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {marks.map((mark) => (
                <tr key={mark._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {mark.student?.firstName} {mark.student?.lastName}
                    <span className="text-xs text-gray-400 ml-1">({mark.student?.rollNumber})</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{mark.subject?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize">{mark.examType}</span> — {mark.examName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {mark.marksObtained} / {mark.totalMarks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{mark.percentage?.toFixed(2)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      mark.grade === 'A+' || mark.grade === 'A' ? 'bg-green-100 text-green-800' :
                      mark.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                      mark.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                      mark.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {mark.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(mark._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Marks;
