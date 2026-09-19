import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import Modal from '../../components/Modal';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    gender: 'male',
    address: '',
    phone: '',
    rollNumber: '',
    parentName: '',
    parentPhone: '',
    isActive: true
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await adminAPI.students.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await adminAPI.students.delete(id);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email || '',
      dateOfBirth: student.dateOfBirth?.split('T')[0] || '',
      gender: student.gender,
      address: student.address,
      phone: student.phone,
      rollNumber: student.rollNumber,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      isActive: student.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await adminAPI.students.update(editingStudent._id, formData);
      } else {
        await adminAPI.students.create(formData);
      }
      setIsModalOpen(false);
      setEditingStudent(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        gender: 'male',
        address: '',
        phone: '',
        rollNumber: '',
        parentName: '',
        parentPhone: '',
        isActive: true
      });
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      alert(error.response?.data?.message || 'Error saving student');
    }
  };

  const openModal = () => {
    setEditingStudent(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
      gender: 'male',
      address: '',
      phone: '',
      rollNumber: '',
      parentName: '',
      parentPhone: '',
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
        <h1 className="text-2xl font-bold">Students</h1>
        <button 
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Student
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.firstName} {student.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{student.rollNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.classId?.name || 'Not Assigned'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{student.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {student.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => handleEdit(student)}
                    className="text-blue-500 hover:text-blue-700 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
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
        title={editingStudent ? 'Edit Student' : 'Add Student'}
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
              <label className="block text-gray-700 mb-1">
                Email <span className="text-gray-400 text-xs">(must match the student's login email to auto-link account)</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                placeholder="student@example.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Roll Number</label>
              <input
                type="text"
                value={formData.rollNumber}
                onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
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
            <div className="col-span-2">
              <label className="block text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Parent Name</label>
              <input
                type="text"
                value={formData.parentName}
                onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Parent Phone</label>
              <input
                type="text"
                value={formData.parentPhone}
                onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
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
              {editingStudent ? 'Update' : 'Create'}
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

export default Students;
