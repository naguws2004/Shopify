import axios from 'axios';
import { API_URL } from '../common/constants';

// Product CRUD API methods
export const createProduct = async (product) => {
  try {
    const response = await axios.post(`${API_URL}/products/`, product, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to create product');
  }
};

export const getProducts = async (page, filterText) => {
  const limit = 10;
  try {
    const response = await axios.get(`${API_URL}/products/`, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        page,
        limit,
        filterText: filterText.trim(),
        includeQty: false
      }
    });
    const { products, total, pages } = response.data;
    return {
      products,
      total,
      page,
      pages
    };
  } catch (error) {
    alert(error);
    throw new Error('Failed to fetch products');
  }
};

export const updateProduct = async (id, product) => {
  try {
    const response = await axios.put(`${API_URL}/products/${id}`, product, {
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
    const response = await axios.delete(`${API_URL}/products/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete product');
  }
};