import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import Modal from '../../components/Modal';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    section: '',
    academicYear: '',
    isActive: true
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await adminAPI.classes.getAll();
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await adminAPI.classes.delete(id);
        fetchClasses();
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

  const handleEdit = (classData) => {
    setEditingClass(classData);
    setFormData({
      name: classData.name,
      grade: classData.grade,
      section: classData.section,
      academicYear: classData.academicYear,
      isActive: classData.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await adminAPI.classes.update(editingClass._id, formData);
      } else {
        await adminAPI.classes.create(formData);
      }
      setIsModalOpen(false);
      setEditingClass(null);
      setFormData({
        name: '',
        grade: '',
        section: '',
        academicYear: '',
        isActive: true
      });
      fetchClasses();
    } catch (error) {
      console.error('Error saving class:', error);
      alert(error.response?.data?.message || 'Error saving class');
    }
  };

  const openModal = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      grade: '',
      section: '',
      academicYear: '',
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
        <h1 className="text-2xl font-bold">Classes</h1>
        <button 
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Create Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classData) => (
          <div key={classData._id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{classData.name}</h3>
            <p className="text-gray-600 mb-2">Grade: {classData.grade}</p>
            <p className="text-gray-600 mb-2">Section: {classData.section}</p>
            <p className="text-gray-600 mb-2">Academic Year: {classData.academicYear}</p>
            <p className="text-gray-600 mb-4">Students: {classData.students?.length || 0}</p>
            <div className="flex gap-2">
              <button 
                onClick={() => handleEdit(classData)}
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(classData._id)}
                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? 'Edit Class' : 'Create Class'}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Class Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              <label className="block text-gray-700 mb-1">Section</label>
              <input
                type="text"
                value={formData.section}
                onChange={(e) => setFormData({...formData, section: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Academic Year</label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
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
              {editingClass ? 'Update' : 'Create'}
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

export default Classes;
