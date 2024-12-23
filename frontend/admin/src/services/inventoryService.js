import axios from 'axios';
import { API_URL } from '../common/constants';

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

export const updateProductInventory = async (updatedProducts) => {
  try {
    const response = await axios.put(`${API_URL}/api/inventory/update/`, updatedProducts, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update product inventory');
  }
};
