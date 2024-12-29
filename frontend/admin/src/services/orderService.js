import axios from 'axios';
import { API_URL } from '../common/constants';


export const getOrders = async (page, filterText, filterOrderId) => {
  const limit = 10;
  try {
    const response = await axios.get(`${API_URL}/orders/`, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        page,
        limit,
        filterText: filterText.trim(),
        filterOrderId: filterOrderId.trim(),
      }
    });
    const { orders, total, pages } = response.data;
    return {
      orders,
      total,
      page,
      pages
    };
  } catch (error) {
    alert(error);
    throw new Error('Failed to fetch orders');
  }
};

export const updateOrder = async (id, product) => {
  try {
    const response = await axios.put(`${API_URL}/orders/${id}`, product, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update product');
  }
};

export const cancelOrder = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/orders/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete product');
  }
};
