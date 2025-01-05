import axios from 'axios';
import { API_URL_USERS } from '../common/constants';

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

export const getAddressById = async (token, id) => {
  try {
    const response = await axios.get(`${API_URL_USERS}/address/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to get address');
  }
};

export const getQueryById = async (token, id) => {
  try {
    const response = await axios.get(`${API_URL_USERS}/query/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to get query');
  }
};

export const addQueryById = async (token, user_id, company, category, major_conditions, minor_conditions) => {
  try {
    const response = await axios.post(`${API_URL_USERS}/query`, {
      user_id, company, category, major_conditions, minor_conditions
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }});
    return response.data;
  } catch (error) {
    throw new Error('Add query failed');
  }
};

