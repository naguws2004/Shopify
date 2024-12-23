import axios from 'axios';
import { API_URL } from '../common/constants';

// Product CRUD API methods
export const createProduct = async (product) => {
  try {
    const response = await axios.post(`${API_URL}/api/products/`, product, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to create product');
  }
};

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/products/`, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch products');
  }
};

export const updateProduct = async (id, product) => {
  try {
    const response = await axios.put(`${API_URL}/api/products/${id}`, product, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update product');
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/api/products/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete product');
  }
};