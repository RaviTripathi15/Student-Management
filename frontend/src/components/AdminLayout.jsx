import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const navLinks = [
    { path: '/admin',          label: 'Dashboard' },
    { path: '/admin/students', label: 'Students'  },
    { path: '/admin/teachers', label: 'Teachers'  },
    { path: '/admin/classes',  label: 'Classes'   },
    { path: '/admin/subjects', label: 'Subjects'  },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            <div className="hidden md:flex gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    location.pathname === link.path
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm hidden md:block">Admin</span>
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
                  ? 'bg-blue-500 text-white'
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

export default AdminLayout;
