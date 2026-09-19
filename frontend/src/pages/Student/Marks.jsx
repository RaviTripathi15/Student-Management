import { useEffect, useState } from 'react';
import { studentAPI } from '../../services/api';

const Marks = () => {
  const [marks, setMarks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [marksRes, summaryRes] = await Promise.all([
        studentAPI.marks.get(),
        studentAPI.marks.getSummary()
      ]);
      setMarks(marksRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Error fetching marks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Marks</h1>

      {summary && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Performance Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Overall Percentage</p>
              <p className="text-2xl font-bold text-blue-600">{summary.overallPercentage}%</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Exams</p>
              <p className="text-2xl font-bold text-green-600">{summary.totalExams}</p>
            </div>
          </div>
          
          <h3 className="text-lg font-bold mt-6 mb-4">Subject-wise Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.summary.map((item) => (
              <div key={item.subject} className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{item.subject}</p>
                <p className="text-sm text-gray-500">Average: {item.averagePercentage}%</p>
                <p className="text-sm text-gray-500">Exams: {item.totalExams}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {marks.map((mark) => (
              <tr key={mark._id}>
                <td className="px-6 py-4 whitespace-nowrap">{mark.subject?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{mark.examType}</td>
                <td className="px-6 py-4 whitespace-nowrap">{mark.examName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {mark.marksObtained} / {mark.totalMarks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{mark.percentage?.toFixed(2)}%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    mark.grade === 'A+' || mark.grade === 'A' ? 'bg-green-100 text-green-800' :
                    mark.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                    mark.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                    mark.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {mark.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Marks;
