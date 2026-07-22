import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(userData));
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  // Render different dashboard based on role
  if (user.role === "Admin") {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  } else if (user.role === "Teacher") {
    return <TeacherDashboard user={user} onLogout={handleLogout} />;
  } else if (user.role === "Student") {
    return <StudentDashboard user={user} onLogout={handleLogout} />;
  }

  return <div>Unknown role</div>;
}

// Admin Dashboard Component
function AdminDashboard({ user, onLogout }) {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    subjects: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const [studentsRes, teachersRes, classesRes, subjectsRes] = await Promise.all([
        API.get("/students", { headers: { Authorization: `Bearer ${token}` } }),
        API.get("/teachers", { headers: { Authorization: `Bearer ${token}` } }),
        API.get("/classes", { headers: { Authorization: `Bearer ${token}` } }),
        API.get("/subjects", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setStats({
        students: studentsRes.data.length,
        teachers: teachersRes.data.length,
        classes: classesRes.data.length,
        subjects: subjectsRes.data.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Admin Dashboard</h1>
        <button onClick={onLogout} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      <p>Welcome, {user.name}!</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginTop: "30px" }}>
        <div style={{ padding: "20px", backgroundColor: "#007bff", color: "white", borderRadius: "8px", textAlign: "center" }}>
          <h3>{stats.students}</h3>
          <p>Total Students</p>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#28a745", color: "white", borderRadius: "8px", textAlign: "center" }}>
          <h3>{stats.teachers}</h3>
          <p>Total Teachers</p>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#ffc107", color: "white", borderRadius: "8px", textAlign: "center" }}>
          <h3>{stats.classes}</h3>
          <p>Total Classes</p>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#17a2b8", color: "white", borderRadius: "8px", textAlign: "center" }}>
          <h3>{stats.subjects}</h3>
          <p>Total Subjects</p>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Quick Actions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px", marginTop: "20px" }}>
          <button onClick={() => navigate("/students")} style={{ padding: "15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Manage Students
          </button>
          <button onClick={() => navigate("/teachers")} style={{ padding: "15px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Manage Teachers
          </button>
          <button onClick={() => navigate("/classes")} style={{ padding: "15px", backgroundColor: "#ffc107", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Manage Classes
          </button>
          <button onClick={() => navigate("/subjects")} style={{ padding: "15px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Manage Subjects
          </button>
        </div>
      </div>
    </div>
  );
}

// Teacher Dashboard Component
function TeacherDashboard({ user, onLogout }) {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      const token = localStorage.getItem("token");
      const classesRes = await API.get("/classes", { headers: { Authorization: `Bearer ${token}` } });
      const subjectsRes = await API.get("/subjects", { headers: { Authorization: `Bearer ${token}` } });
      
      setClasses(classesRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Teacher Dashboard</h1>
        <button onClick={onLogout} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      <p>Welcome, {user.name}!</p>

      <div style={{ marginTop: "30px" }}>
        <h2>Assigned Classes ({classes.length})</h2>
        {classes.length > 0 ? (
          <ul>
            {classes.map((cls) => (
              <li key={cls._id} style={{ padding: "10px", margin: "5px 0", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
                {cls.name} - {cls.grade} {cls.section}
              </li>
            ))}
          </ul>
        ) : (
          <p>No classes assigned yet.</p>
        )}
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Assigned Subjects ({subjects.length})</h2>
        {subjects.length > 0 ? (
          <ul>
            {subjects.map((subject) => (
              <li key={subject._id} style={{ padding: "10px", margin: "5px 0", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
                {subject.name} ({subject.code})
              </li>
            ))}
          </ul>
        ) : (
          <p>No subjects assigned yet.</p>
        )}
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Quick Actions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px", marginTop: "20px" }}>
          <button style={{ padding: "15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Mark Attendance
          </button>
          <button style={{ padding: "15px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Create Assignment
          </button>
          <button style={{ padding: "15px", backgroundColor: "#ffc107", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Upload Marks
          </button>
        </div>
      </div>
    </div>
  );
}

// Student Dashboard Component
function StudentDashboard({ user, onLogout }) {
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem("token");
      // Note: These endpoints would need to be adjusted based on actual student ID
      const attendanceRes = await API.get("/attendance", { headers: { Authorization: `Bearer ${token}` } });
      const assignmentsRes = await API.get("/assignments", { headers: { Authorization: `Bearer ${token}` } });
      const marksRes = await API.get("/marks", { headers: { Authorization: `Bearer ${token}` } });
      
      setAttendance(attendanceRes.data);
      setAssignments(assignmentsRes.data);
      setMarks(marksRes.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Student Dashboard</h1>
        <button onClick={onLogout} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      <p>Welcome, {user.name}!</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginTop: "30px" }}>
        <div style={{ padding: "20px", backgroundColor: "#007bff", color: "white", borderRadius: "8px", textAlign: "center" }}>
          <h3>{attendance.length}</h3>
          <p>Attendance Records</p>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#28a745", color: "white", borderRadius: "8px", textAlign: "center" }}>
          <h3>{assignments.length}</h3>
          <p>Assignments</p>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#ffc107", color: "white", borderRadius: "8px", textAlign: "center" }}>
          <h3>{marks.length}</h3>
          <p>Marks Records</p>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Recent Assignments</h2>
        {assignments.length > 0 ? (
          <ul>
            {assignments.slice(0, 5).map((assignment) => (
              <li key={assignment._id} style={{ padding: "10px", margin: "5px 0", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
                <strong>{assignment.title}</strong> - Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No assignments assigned yet.</p>
        )}
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Recent Marks</h2>
        {marks.length > 0 ? (
          <ul>
            {marks.slice(0, 5).map((mark) => (
              <li key={mark._id} style={{ padding: "10px", margin: "5px 0", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
                {mark.subject?.name || "Unknown Subject"}: {mark.obtainedMarks}/{mark.totalMarks} ({mark.percentage?.toFixed(1)}%)
              </li>
            ))}
          </ul>
        ) : (
          <p>No marks available yet.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;