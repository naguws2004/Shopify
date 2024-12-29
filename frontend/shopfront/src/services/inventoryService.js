import axios from 'axios';
import { API_URL_INVENTORY } from '../common/constants';

export const reduceProductInventory = async (token, updatedProducts) => {
  try {
    const response = await axios.put(`${API_URL_INVENTORY}/reduce/`, updatedProducts, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update product inventory');
  }
};

export const increaseProductInventory = async (token, updatedProducts) => {
  try {
    const response = await axios.put(`${API_URL_INVENTORY}/increase/`, updatedProducts, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update product inventory');
  }
};