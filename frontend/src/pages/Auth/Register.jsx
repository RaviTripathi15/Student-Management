import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field error on change
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
    setError('');
  };

  // Client-side password validation matching backend rules exactly
  const validatePassword = (password) => {
    if (password.length < 8)
      return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password))
      return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password))
      return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password))
      return 'Password must contain at least one number';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Client-side validation
    const pwdError = validatePassword(formData.password);
    if (pwdError) {
      setFieldErrors({ password: pwdError });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      const userData = await register(formData.email, formData.password, formData.role);
      if (userData.role === 'admin') navigate('/admin');
      else if (userData.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (err) {
      // Handle validation errors array from backend
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        const mapped = {};
        data.errors.forEach((e) => { mapped[e.field] = e.message; });
        setFieldErrors(mapped);
      } else {
        setError(data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
      fieldErrors[field]
        ? 'border-red-400 focus:ring-red-300'
        : 'border-gray-300 focus:ring-blue-500'
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {/* General error */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputClass('email')}
              required
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 text-sm font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 8 chars, uppercase, lowercase, number"
              className={inputClass('password')}
              required
            />
            {fieldErrors.password ? (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
            ) : (
              <p className="text-gray-400 text-xs mt-1">
                At least 8 characters with uppercase, lowercase and a number
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-1 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className={inputClass('confirmPassword')}
              required
            />
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
