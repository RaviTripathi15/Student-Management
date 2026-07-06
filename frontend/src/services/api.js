import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  students: {
    create: (data) => api.post('/admin/students', data),
    getAll: () => api.get('/admin/students'),
    getById: (id) => api.get(`/admin/students/${id}`),
    update: (id, data) => api.put(`/admin/students/${id}`, data),
    delete: (id) => api.delete(`/admin/students/${id}`)
  },
  teachers: {
    create: (data) => api.post('/admin/teachers', data),
    getAll: () => api.get('/admin/teachers'),
    getById: (id) => api.get(`/admin/teachers/${id}`),
    update: (id, data) => api.put(`/admin/teachers/${id}`, data),
    delete: (id) => api.delete(`/admin/teachers/${id}`)
  },
  classes: {
    create: (data) => api.post('/admin/classes', data),
    getAll: () => api.get('/admin/classes'),
    getById: (id) => api.get(`/admin/classes/${id}`),
    update: (id, data) => api.put(`/admin/classes/${id}`, data),
    delete: (id) => api.delete(`/admin/classes/${id}`)
  },
  subjects: {
    create: (data) => api.post('/admin/subjects', data),
    getAll: () => api.get('/admin/subjects'),
    getById: (id) => api.get(`/admin/subjects/${id}`),
    update: (id, data) => api.put(`/admin/subjects/${id}`, data),
    delete: (id) => api.delete(`/admin/subjects/${id}`)
  }
};

export const teacherAPI = {
  getAssigned: () => api.get('/teacher/assigned'),
  getClassStudents: (classId) => api.get(`/teacher/classes/${classId}/students`),
  attendance: {
    mark: (data) => api.post('/teacher/attendance', data),
    getClass: (params) => api.get('/teacher/attendance/class', { params }),
    getStudent: (studentId) => api.get(`/teacher/attendance/student/${studentId}`)
  },
  assignments: {
    create: (data) => api.post('/teacher/assignments', data),
    getAll: () => api.get('/teacher/assignments'),
    getById: (id) => api.get(`/teacher/assignments/${id}`),
    update: (id, data) => api.put(`/teacher/assignments/${id}`, data),
    delete: (id) => api.delete(`/teacher/assignments/${id}`),
    submit: (assignmentId, data) => api.post(`/teacher/assignments/${assignmentId}/submit`, data),
    grade: (assignmentId, studentId, data) => api.put(`/teacher/assignments/${assignmentId}/submissions/${studentId}/grade`, data)
  },
  marks: {
    create: (data) => api.post('/teacher/marks', data),
    getAll: (params) => api.get('/teacher/marks', { params }),
    getStudent: (studentId) => api.get(`/teacher/marks/student/${studentId}`),
    update: (id, data) => api.put(`/teacher/marks/${id}`, data),
    delete: (id) => api.delete(`/teacher/marks/${id}`)
  }
};

export const studentAPI = {
  profile: {
    get: () => api.get('/student/profile'),
    update: (data) => api.put('/student/profile', data)
  },
  attendance: {
    get: () => api.get('/student/attendance'),
    getStats: () => api.get('/student/attendance/stats')
  },
  assignments: {
    getAll: () => api.get('/student/assignments'),
    getById: (id) => api.get(`/student/assignments/${id}`)
  },
  marks: {
    get: () => api.get('/student/marks'),
    getSummary: () => api.get('/student/marks/summary')
  }
};

export default api;
