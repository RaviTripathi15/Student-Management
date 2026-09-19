import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import Modal from '../../components/Modal';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    qualification: '',
    specialization: '',
    isActive: true
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await adminAPI.teachers.getAll();
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await adminAPI.teachers.delete(id);
        fetchTeachers();
      } catch (error) {
        console.error('Error deleting teacher:', error);
      }
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone,
      qualification: teacher.qualification,
      specialization: teacher.specialization,
      isActive: teacher.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await adminAPI.teachers.update(editingTeacher._id, formData);
      } else {
        await adminAPI.teachers.create(formData);
      }
      setIsModalOpen(false);
      setEditingTeacher(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        qualification: '',
        specialization: '',
        isActive: true
      });
      fetchTeachers();
    } catch (error) {
      console.error('Error saving teacher:', error);
      alert(error.response?.data?.message || 'Error saving teacher');
    }
  };

  const openModal = () => {
    setEditingTeacher(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      qualification: '',
      specialization: '',
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
        <h1 className="text-2xl font-bold">Teachers</h1>
        <button 
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Teacher
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <tr key={teacher._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {teacher.firstName} {teacher.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.specialization}</td>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    teacher.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {teacher.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => handleEdit(teacher)}
                    className="text-blue-500 hover:text-blue-700 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(teacher._id)}
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
        title={editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Qualification</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 mb-1">Specialization</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
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
              {editingTeacher ? 'Update' : 'Create'}
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

export default Teachers;
