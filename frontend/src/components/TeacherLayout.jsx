import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TeacherLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const navLinks = [
    { path: '/teacher',             label: 'Dashboard'  },
    { path: '/teacher/attendance',  label: 'Attendance' },
    { path: '/teacher/assignments', label: 'Assignments'},
    { path: '/teacher/marks',       label: 'Marks'      },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-gray-800">Teacher Panel</h1>
            <div className="hidden md:flex gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    location.pathname === link.path
                      ? 'bg-green-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm hidden md:block">Teacher</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden gap-2 mt-3 flex-wrap">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                location.pathname === link.path
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
};

export default TeacherLayout;
