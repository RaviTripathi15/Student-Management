import { useEffect, useState } from 'react';
import { studentAPI } from '../../services/api';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await studentAPI.assignments.getAll();
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Assignments</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div key={assignment._id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-2">{assignment.title}</h3>
            <p className="text-gray-600 mb-2">{assignment.description}</p>
            <p className="text-sm text-gray-500 mb-2">Subject: {assignment.subject?.name}</p>
            <p className="text-sm text-gray-500 mb-2">
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 mb-2">Total Marks: {assignment.totalMarks}</p>
            <div className="mb-4">
              <span className={`px-2 py-1 rounded-full text-xs ${
                assignment.submissionStatus === 'graded' ? 'bg-green-100 text-green-800' :
                assignment.submissionStatus === 'submitted' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {assignment.submissionStatus}
              </span>
            </div>
            {assignment.submissionStatus === 'graded' && (
              <p className="text-sm text-gray-500 mb-4">
                Marks Obtained: {assignment.marks} / {assignment.totalMarks}
              </p>
            )}
            {assignment.submissionStatus === 'pending' && (
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                Submit Assignment
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
