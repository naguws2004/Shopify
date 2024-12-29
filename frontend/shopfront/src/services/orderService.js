import axios from 'axios';
import { API_URL_ORDERS } from '../common/constants';

export const createOrder = async (token, user_id) => {
  try {
    const response = await axios.post(`${API_URL_ORDERS}/`, {
      user_id
    }, 
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }});
    return response.data;
  } catch (error) {
    throw new Error('Order creation failed');
  }
};

export const createOrderDetail = async (token, order_id, product_id) => {
  try {
    const response = await axios.post(`${API_URL_ORDERS}/detail`, {
      order_id,
      product_id
    }, 
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }});
    return response.data;
  } catch (error) {
    throw new Error('Order detail creation failed');
  }
};

export const addOrderAddressById = async (token, order_id, address, city, state, pincode, contactno) => {
  try {
    const response = await axios.post(`${API_URL_ORDERS}/address`, {
      order_id, address, city, state, pincode, contactno
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }});
    return response.data;
  } catch (error) {
    throw new Error('Add address failed');
  }
};

export const cancelOrder = async (token, order_id) => {
  try {
    const response = await axios.put(`${API_URL_ORDERS}/cancel/${order_id}`, {},
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }});
    return response.data;
  } catch (error) {
    throw new Error('Order cancel failed');
  }
};

export const getProductsByOrderId = async (token, order_id) => {
  try {
    const response = await axios.get(`${API_URL_ORDERS}/details/${order_id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to get order details');
  }
};