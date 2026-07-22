import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    user: "",
    employeeId: "",
    department: "",
    subjects: [],
    classes: [],
    qualification: "",
    experience: "",
    phone: "",
    address: "",
    salary: "",
    status: "Active"
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTeachers();
    fetchSubjects();
    fetchClasses();
  }, [navigate]);

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/teachers", { headers: { Authorization: `Bearer ${token}` } });
      setTeachers(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/subjects", { headers: { Authorization: `Bearer ${token}` } });
      setSubjects(res.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/classes", { headers: { Authorization: `Bearer ${token}` } });
      setClasses(res.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "subjects" || name === "classes") {
      const selectedValues = Array.from(e.target.selectedOptions).map(option => option.value);
      setFormData({ ...formData, [name]: selectedValues });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingTeacher) {
        await API.put(`/teachers/${editingTeacher._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await API.post("/teachers", formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      setEditingTeacher(null);
      setFormData({
        user: "",
        employeeId: "",
        department: "",
        subjects: [],
        classes: [],
        qualification: "",
        experience: "",
        phone: "",
        address: "",
        salary: "",
        status: "Active"
      });
      fetchTeachers();
    } catch (error) {
      setError(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      user: teacher.user?._id || "",
      employeeId: teacher.employeeId,
      department: teacher.department || "",
      subjects: teacher.subjects?.map(s => s._id) || [],
      classes: teacher.classes?.map(c => c._id) || [],
      qualification: teacher.qualification || "",
      experience: teacher.experience || "",
      phone: teacher.phone || "",
      address: teacher.address || "",
      salary: teacher.salary || "",
      status: teacher.status || "Active"
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        const token = localStorage.getItem("token");
        await API.delete(`/teachers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTeachers();
      } catch (error) {
        setError(error.response?.data?.message || "Delete failed");
      }
    }
  };

  const handleAddNew = () => {
    setEditingTeacher(null);
    setFormData({
      user: "",
      employeeId: "",
      department: "",
      subjects: [],
      classes: [],
      qualification: "",
      experience: "",
      phone: "",
      address: "",
      salary: "",
      status: "Active"
    });
    setShowModal(true);
  };

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Teacher Management</h1>
        <button
          onClick={() => navigate("/dashboard")}
          style={{ padding: "10px 20px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "10px" }}
        >
          Back to Dashboard
        </button>
        <button
          onClick={handleAddNew}
          style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Add New Teacher
        </button>
      </div>

      {error && <div style={{ padding: "10px", marginBottom: "20px", backgroundColor: "#dc3545", color: "white", borderRadius: "4px" }}>{error}</div>}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
          <thead>
            <tr style={{ backgroundColor: "#28a745", color: "white" }}>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Employee ID</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Name</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Email</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Department</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Qualification</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Experience</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Phone</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "center", border: "1px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <tr key={teacher._id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{teacher.employeeId}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{teacher.user?.name || "N/A"}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{teacher.user?.email || "N/A"}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{teacher.department || "N/A"}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{teacher.qualification || "N/A"}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{teacher.experience || 0} years</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{teacher.phone || "N/A"}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: teacher.status === "Active" ? "#28a745" : "#dc3545",
                      color: "white"
                    }}>
                      {teacher.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
                    <button
                      onClick={() => handleEdit(teacher)}
                      style={{ padding: "5px 10px", backgroundColor: "#ffc107", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "5px" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(teacher._id)}
                      style={{ padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ padding: "20px", textAlign: "center", border: "1px solid #ddd" }}>
                  No teachers found. Click "Add New Teacher" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", width: "90%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ marginBottom: "20px" }}>{editingTeacher ? "Edit Teacher" : "Add New Teacher"}</h2>
            {error && <div style={{ padding: "10px", marginBottom: "15px", backgroundColor: "#dc3545", color: "white", borderRadius: "4px" }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Employee ID *</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>User ID *</label>
                <input
                  type="text"
                  name="user"
                  value={formData.user}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter User ID from Users collection"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Subjects (Hold Ctrl to select multiple)</label>
                <select
                  name="subjects"
                  multiple
                  value={formData.subjects}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", height: "100px" }}
                >
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>{subject.name} ({subject.code})</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Classes (Hold Ctrl to select multiple)</label>
                <select
                  name="classes"
                  multiple
                  value={formData.classes}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", height: "100px" }}
                >
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>{cls.name} - {cls.grade} {cls.section}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Experience (years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  min="0"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  type="submit"
                  style={{ flex: 1, padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  {editingTeacher ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: "10px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherManagement;
