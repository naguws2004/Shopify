import axios from 'axios';
import { API_URL } from '../common/constants';

// User CRUD API methods
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/`, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};

export const updateUser = async (id, user) => {
  try {
    const response = await axios.put(`${API_URL}/users/${id}`, user, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update user');
  }
};

export const updateUserPassword = async (id, user) => {
  try {
    const response = await axios.put(`${API_URL}/users/password/${id}`, user, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    alert(error);
    throw new Error('Failed to update user');
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete user');
  }
};