import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/students';

const API = axios.create({
  baseURL: API_URL
});

// Add header to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchStudents = async () => {
  const response = await API.get('/');
  return response.data;
};

export const createStudent = async (studentData) => {
  const response = await API.post('/', studentData);
  return response.data;
};

export const updateStudent = async (id, studentData) => {
  const response = await API.put(`/${id}`, studentData);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await API.delete(`/${id}`);
  return response.data;
};

export const bulkCreateStudents = async (students) => {
  const response = await API.post('/bulk', { students });
  return response.data;
};
