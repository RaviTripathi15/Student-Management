import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AttendanceManagement() {
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchClasses();
    fetchSubjects();
    fetchAttendance();
  }, [navigate]);

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

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/attendance", { headers: { Authorization: `Bearer ${token}` } });
      setAttendance(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setLoading(false);
    }
  };

  const fetchStudentsByClass = async (classId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/students/class/${classId}`, { headers: { Authorization: `Bearer ${token}` } });
      setStudents(res.data);
      
      // Initialize attendance data for all students
      const initialData = {};
      res.data.forEach(student => {
        initialData[student._id] = "Present";
      });
      setAttendanceData(initialData);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    if (classId) {
      fetchStudentsByClass(classId);
    } else {
      setStudents([]);
      setAttendanceData({});
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData({
      ...attendanceData,
      [studentId]: status
    });
  };

  const handleMarkAttendance = async () => {
    if (!selectedClass || !selectedDate) {
      setError("Please select a class and date");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const attendanceRecords = Object.keys(attendanceData).map(studentId => ({
        student: studentId,
        class: selectedClass,
        date: selectedDate,
        status: attendanceData[studentId]
      }));

      await API.post("/attendance/bulk", {
        class: selectedClass,
        date: selectedDate,
        attendanceRecords
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowModal(false);
      setAttendanceData({});
      setStudents([]);
      setSelectedClass("");
      fetchAttendance();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to mark attendance");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this attendance record?")) {
      try {
        const token = localStorage.getItem("token");
        await API.delete(`/attendance/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchAttendance();
      } catch (error) {
        setError(error.response?.data?.message || "Delete failed");
      }
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Attendance Management</h1>
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            style={{ padding: "10px 20px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "10px" }}
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => setShowModal(true)}
            style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Mark Attendance
          </button>
        </div>
      </div>

      {error && <div style={{ padding: "10px", marginBottom: "20px", backgroundColor: "#dc3545", color: "white", borderRadius: "4px" }}>{error}</div>}

      <div style={{ marginBottom: "20px" }}>
        <h2>Attendance Records ({attendance.length})</h2>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
          <thead>
            <tr style={{ backgroundColor: "#007bff", color: "white" }}>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Date</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Student</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Class</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Subject</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Marked By</th>
              <th style={{ padding: "12px", textAlign: "center", border: "1px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length > 0 ? (
              attendance.map((record) => (
                <tr key={record._id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {record.student?.rollNumber || "N/A"} - {record.student?.user?.name || "N/A"}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {record.class?.name || "N/A"}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {record.subject?.name || "N/A"}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: 
                        record.status === "Present" ? "#28a745" :
                        record.status === "Absent" ? "#dc3545" :
                        record.status === "Late" ? "#ffc107" :
                        record.status === "Excused" ? "#17a2b8" : "#6c757d",
                      color: "white"
                    }}>
                      {record.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {record.markedBy?.name || "N/A"}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
                    <button
                      onClick={() => handleDelete(record._id)}
                      style={{ padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ padding: "20px", textAlign: "center", border: "1px solid #ddd" }}>
                  No attendance records found. Click "Mark Attendance" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", width: "90%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ marginBottom: "20px" }}>Mark Attendance</h2>
            {error && <div style={{ padding: "10px", marginBottom: "15px", backgroundColor: "#dc3545", color: "white", borderRadius: "4px" }}>{error}</div>}
            
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Select Class *</label>
              <select
                value={selectedClass}
                onChange={handleClassChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>{cls.name} - {cls.grade} {cls.section}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Select Date *</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>

            {students.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3>Students ({students.length})</h3>
                <div style={{ overflowX: "auto", marginTop: "15px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f8f9fa" }}>
                        <th style={{ padding: "10px", textAlign: "left", border: "1px solid #ddd" }}>Roll No</th>
                        <th style={{ padding: "10px", textAlign: "left", border: "1px solid #ddd" }}>Name</th>
                        <th style={{ padding: "10px", textAlign: "left", border: "1px solid #ddd" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student._id} style={{ borderBottom: "1px solid #ddd" }}>
                          <td style={{ padding: "10px", border: "1px solid #ddd" }}>{student.rollNumber}</td>
                          <td style={{ padding: "10px", border: "1px solid #ddd" }}>{student.user?.name || "N/A"}</td>
                          <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                            <select
                              value={attendanceData[student._id] || "Present"}
                              onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                              style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                            >
                              <option value="Present">Present</option>
                              <option value="Absent">Absent</option>
                              <option value="Late">Late</option>
                              <option value="Excused">Excused</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                onClick={handleMarkAttendance}
                disabled={students.length === 0}
                style={{ flex: 1, padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: students.length === 0 ? "not-allowed" : "pointer" }}
              >
                Mark Attendance
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setAttendanceData({});
                  setStudents([]);
                  setSelectedClass("");
                }}
                style={{ flex: 1, padding: "10px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceManagement;
