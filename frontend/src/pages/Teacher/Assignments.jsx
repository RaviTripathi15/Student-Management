import { useEffect, useState } from 'react';
import { teacherAPI } from '../../services/api';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    dueDate: '',
    totalMarks: 100
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [assignmentsRes, assignedRes] = await Promise.all([
        teacherAPI.assignments.getAll(),
        teacherAPI.getAssigned()
      ]);
      setAssignments(assignmentsRes.data);
      setAssignedSubjects(assignedRes.data.subjects || []);
      setAssignedClasses(assignedRes.data.classes || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.subject) {
      setFormError('Please select a subject.');
      return;
    }
    if (!formData.class) {
      setFormError('Please select a class.');
      return;
    }

    try {
      await teacherAPI.assignments.create(formData);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        subject: '',
        class: '',
        dueDate: '',
        totalMarks: 100
      });
      fetchAll();
    } catch (error) {
      console.error('Error creating assignment:', error);
      setFormError(error.response?.data?.message || 'Failed to create assignment.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await teacherAPI.assignments.delete(id);
        fetchAll();
      } catch (error) {
        console.error('Error deleting assignment:', error);
      }
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <button
          onClick={() => { setShowForm(!showForm); setFormError(''); }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Create Assignment'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Create New Assignment</h2>

          {formError && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{formError}</div>
          )}

          {assignedSubjects.length === 0 || assignedClasses.length === 0 ? (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-4">
              ⚠️ You need to be assigned at least one subject and one class before creating assignments.
              Contact your administrator.
            </div>
          ) : null}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* Subject dropdown — uses teacher's assigned subjects */}
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

              {/* Class dropdown — uses teacher's assigned classes */}
              <div>
                <label className="block text-gray-700 mb-2">Class</label>
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
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

              <div>
                <label className="block text-gray-700 mb-2">Total Marks</label>
                <input
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="3"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Create Assignment
            </button>
          </form>
        </div>
      )}

      {assignments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          No assignments yet. Click "Create Assignment" to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <div key={assignment._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-2">{assignment.title}</h3>
              <p className="text-gray-600 mb-2 text-sm line-clamp-2">{assignment.description}</p>
              <p className="text-sm text-gray-500 mb-1">
                Subject: <span className="font-medium">{assignment.subject?.name || '—'}</span>
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Class: <span className="font-medium">{assignment.class?.name || '—'}</span>
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Due: <span className="font-medium">{new Date(assignment.dueDate).toLocaleDateString()}</span>
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Total Marks: <span className="font-medium">{assignment.totalMarks}</span>
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Submissions: <span className="font-medium">{assignment.submissions?.length || 0}</span>
              </p>
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm">
                  View Submissions
                </button>
                <button
                  onClick={() => handleDelete(assignment._id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assignments;
