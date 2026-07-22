import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    classes: [],
    teachers: [],
    credits: 1,
    totalMarks: 100,
    passMarks: 40,
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
    fetchSubjects();
    fetchClasses();
    fetchTeachers();
  }, [navigate]);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/subjects", { headers: { Authorization: `Bearer ${token}` } });
      setSubjects(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setLoading(false);
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

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/teachers", { headers: { Authorization: `Bearer ${token}` } });
      setTeachers(res.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "classes" || name === "teachers") {
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
      if (editingSubject) {
        await API.put(`/subjects/${editingSubject._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await API.post("/subjects", formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      setEditingSubject(null);
      setFormData({
        name: "",
        code: "",
        description: "",
        classes: [],
        teachers: [],
        credits: 1,
        totalMarks: 100,
        passMarks: 40,
        status: "Active"
      });
      fetchSubjects();
    } catch (error) {
      setError(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      description: subject.description || "",
      classes: subject.classes?.map(c => c._id) || [],
      teachers: subject.teachers?.map(t => t._id) || [],
      credits: subject.credits || 1,
      totalMarks: subject.totalMarks || 100,
      passMarks: subject.passMarks || 40,
      status: subject.status || "Active"
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        const token = localStorage.getItem("token");
        await API.delete(`/subjects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchSubjects();
      } catch (error) {
        setError(error.response?.data?.message || "Delete failed");
      }
    }
  };

  const handleAddNew = () => {
    setEditingSubject(null);
    setFormData({
      name: "",
      code: "",
      description: "",
      classes: [],
      teachers: [],
      credits: 1,
      totalMarks: 100,
      passMarks: 40,
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
        <h1>Subject Management</h1>
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
          Add New Subject
        </button>
      </div>

      {error && <div style={{ padding: "10px", marginBottom: "20px", backgroundColor: "#dc3545", color: "white", borderRadius: "4px" }}>{error}</div>}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
          <thead>
            <tr style={{ backgroundColor: "#17a2b8", color: "white" }}>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Code</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Name</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Description</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Credits</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Total Marks</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Pass Marks</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Classes</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Teachers</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "center", border: "1px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length > 0 ? (
              subjects.map((subject) => (
                <tr key={subject._id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{subject.code}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{subject.name}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{subject.description || "N/A"}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{subject.credits}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{subject.totalMarks}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{subject.passMarks}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{subject.classes?.length || 0}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{subject.teachers?.length || 0}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: subject.status === "Active" ? "#28a745" : "#dc3545",
                      color: "white"
                    }}>
                      {subject.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
                    <button
                      onClick={() => handleEdit(subject)}
                      style={{ padding: "5px 10px", backgroundColor: "#ffc107", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "5px" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(subject._id)}
                      style={{ padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ padding: "20px", textAlign: "center", border: "1px solid #ddd" }}>
                  No subjects found. Click "Add New Subject" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", width: "90%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ marginBottom: "20px" }}>{editingSubject ? "Edit Subject" : "Add New Subject"}</h2>
            {error && <div style={{ padding: "10px", marginBottom: "15px", backgroundColor: "#dc3545", color: "white", borderRadius: "4px" }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Subject Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Subject Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
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
                <label style={{ display: "block", marginBottom: "5px" }}>Teachers (Hold Ctrl to select multiple)</label>
                <select
                  name="teachers"
                  multiple
                  value={formData.teachers}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", height: "100px" }}
                >
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>{teacher.user?.name} ({teacher.employeeId})</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Credits</label>
                <input
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleInputChange}
                  min="1"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Total Marks</label>
                <input
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleInputChange}
                  min="1"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Pass Marks</label>
                <input
                  type="number"
                  name="passMarks"
                  value={formData.passMarks}
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
                  {editingSubject ? "Update" : "Create"}
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

export default SubjectManagement;
