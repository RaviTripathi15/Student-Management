import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import Modal from '../../components/Modal';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    grade: '',
    credits: '',
    isActive: true
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await adminAPI.subjects.getAll();
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await adminAPI.subjects.delete(id);
        fetchSubjects();
      } catch (error) {
        console.error('Error deleting subject:', error);
      }
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      grade: subject.grade,
      credits: subject.credits,
      isActive: subject.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await adminAPI.subjects.update(editingSubject._id, formData);
      } else {
        await adminAPI.subjects.create(formData);
      }
      setIsModalOpen(false);
      setEditingSubject(null);
      setFormData({
        name: '',
        code: '',
        grade: '',
        credits: '',
        isActive: true
      });
      fetchSubjects();
    } catch (error) {
      console.error('Error saving subject:', error);
      alert(error.response?.data?.message || 'Error saving subject');
    }
  };

  const openModal = () => {
    setEditingSubject(null);
    setFormData({
      name: '',
      code: '',
      grade: '',
      credits: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <button 
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Subject
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subjects.map((subject) => (
              <tr key={subject._id}>
                <td className="px-6 py-4 whitespace-nowrap">{subject.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{subject.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{subject.grade}</td>
                <td className="px-6 py-4 whitespace-nowrap">{subject.credits}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    subject.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {subject.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => handleEdit(subject)}
                    className="text-blue-500 hover:text-blue-700 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subject._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? 'Edit Subject' : 'Add Subject'}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Subject Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Subject Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Grade</label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Credits</label>
              <input
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({...formData, credits: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {editingSubject ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Subjects;
