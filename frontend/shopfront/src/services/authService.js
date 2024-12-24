import axios from 'axios';
import { API_URL_USERS } from '../common/constants';

export const register = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL_USERS}/register`, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error('Registration failed');
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.get(`${API_URL_USERS}/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};

export const getUserById = async (token, id) => {
  try {
    const response = await axios.get(`${API_URL_USERS}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to get user');
  }
};

export const updateUser = async (token, id, user) => {
  try {
    const response = await axios.put(`${API_URL_USERS}/${id}`, user, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update user');
  }
};

export const updateUserPassword = async (token, id, user) => {
  try {
    const response = await axios.put(`${API_URL_USERS}/password/${id}`, user, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update user');
  }
};