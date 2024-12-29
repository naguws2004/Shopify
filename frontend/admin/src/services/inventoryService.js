import axios from 'axios';
import { API_URL } from '../common/constants';

export const updateProductInventory = async (updatedProducts) => {
  try {
    const response = await axios.put(`${API_URL}/inventory/update/`, updatedProducts, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    alert(error);
    throw new Error('Failed to update product inventory');
  }
};
