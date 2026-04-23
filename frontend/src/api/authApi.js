import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const signup = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

export const signin = async (userData) => {
  const response = await axios.post(`${API_URL}/signin`, userData);
  return response.data;
};

export const resetPassword = async (userData) => {
  const response = await axios.post(`${API_URL}/reset-password`, userData);
  return response.data;
};
