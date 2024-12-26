import axios from 'axios';
import { API_URL_CART } from '../common/constants';

export const saveCart = async (token, user_id, product_id) => {
  try {
    const response = await axios.post(`${API_URL_CART}/`, {
      user_id,
      product_id
    }, 
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }});
    return response.data;
  } catch (error) {
    throw new Error('Save Cart failed');
  }
};

export const getCartByUserId = async (token, user_id) => {
  try {
    const response = await axios.get(`${API_URL_CART}/${user_id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to get cart');
  }
};
