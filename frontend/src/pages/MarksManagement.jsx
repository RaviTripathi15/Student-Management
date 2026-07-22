import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function MarksManagement() {
  const [marks, setMarks] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMarks, setEditingMarks] = useState(null);
  const [formData, setFormData] = useState({
    student: "",
    subject: "",
    class: "",
    examType: "Other",
    obtainedMarks: "",
    totalMarks: "",
    remarks: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMarks();
    fetchClasses();
    fetchSubjects();
  }, [navigate]);

  const fetchMarks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/marks", { headers: { Authorization: `Bearer ${token}` } });
      setMarks(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching marks:", error);
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

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/subjects", { headers: { Authorization: `Bearer ${token}` } });
      setSubjects(res.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchStudentsByClass = async (classId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/students/class/${classId}`, { headers: { Authorization: `Bearer ${token}` } });
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Fetch students when class is selected
    if (name === "class" && value) {
      fetchStudentsByClass(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingMarks) {
        await API.put(`/marks/${editingMarks._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await API.post("/marks", formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      setEditingMarks(null);
      setFormData({
        student: "",
        subject: "",
        class: "",
        examType: "Other",
        obtainedMarks: "",
        totalMarks: "",
        remarks: ""
      });
      setStudents([]);
      fetchMarks();
    } catch (error) {
      setError(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (mark) => {
    setEditingMarks(mark);
    setFormData({
      student: mark.student?._id || "",
      subject: mark.subject?._id || "",
      class: mark.class?._id || "",
      examType: mark.examType || "Other",
      obtainedMarks: mark.obtainedMarks,
      totalMarks: mark.totalMarks,
      remarks: mark.remarks || ""
    });
    if (mark.class?._id) {
      fetchStudentsByClass(mark.class._id);
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this marks record?")) {
      try {
        const token = localStorage.getItem("token");
        await API.delete(`/marks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchMarks();
      } catch (error) {
        setError(error.response?.data?.message || "Delete failed");
      }
    }
  };

  const handleAddNew = () => {
    setEditingMarks(null);
    setFormData({
      student: "",
      subject: "",
      class: "",
      examType: "Other",
      obtainedMarks: "",
      totalMarks: "",
      remarks: ""
    });
    setStudents([]);
    setShowModal(true);
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A+": return "#28a745";
      case "A": return "#007bff";
      case "B": return "#17a2b8";
      case "C": return "#ffc107";
      case "D": return "#fd7e14";
      case "F": return "#dc3545";
      default: return "#6c757d";
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Marks Management</h1>
        <div>
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
            Add Marks
          </button>
        </div>
      </div>

      {error && <div style={{ padding: "10px", marginBottom: "20px", backgroundColor: "#dc3545", color: "white", borderRadius: "4px" }}>{error}</div>}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
          <thead>
            <tr style={{ backgroundColor: "#17a2b8", color: "white" }}>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Student</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Class</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Subject</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Exam Type</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Obtained</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Total</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Percentage</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Grade</th>
              <th style={{ padding: "12px", textAlign: "center", border: "1px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {marks.length > 0 ? (
              marks.map((mark) => (
                <tr key={mark._id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {mark.student?.rollNumber || "N/A"} - {mark.student?.user?.name || "N/A"}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{mark.class?.name || "N/A"}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{mark.subject?.name || "N/A"}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{mark.examType}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{mark.obtainedMarks}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{mark.totalMarks}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{mark.percentage?.toFixed(1)}%</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: getGradeColor(mark.grade),
                      color: "white",
                      fontWeight: "bold"
                    }}>
                      {mark.grade}
                    </span>
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
                    <button
                      onClick={() => handleEdit(mark)}
                      style={{ padding: "5px 10px", backgroundColor: "#ffc107", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "5px" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(mark._id)}
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
                  No marks records found. Click "Add Marks" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", width: "90%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ marginBottom: "20px" }}>{editingMarks ? "Edit Marks" : "Add Marks"}</h2>
            {error && <div style={{ padding: "10px", marginBottom: "15px", backgroundColor: "#dc3545", color: "white", borderRadius: "4px" }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Class *</label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>{cls.name} - {cls.grade} {cls.section}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Student *</label>
                <select
                  name="student"
                  value={formData.student}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.class}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>{student.rollNumber} - {student.user?.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Subject *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>{subject.name} ({subject.code})</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Exam Type</label>
                <select
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                >
                  <option value="Midterm">Midterm</option>
                  <option value="Final">Final</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Obtained Marks *</label>
                <input
                  type="number"
                  name="obtainedMarks"
                  value={formData.obtainedMarks}
                  onChange={handleInputChange}
                  required
                  min="0"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Total Marks *</label>
                <input
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleInputChange}
                  required
                  min="1"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  rows="2"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  type="submit"
                  style={{ flex: 1, padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  {editingMarks ? "Update" : "Add"}
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

export default MarksManagement;
