import axios from 'axios';
import { API_URL } from '../common/constants';

export const getOrders = async (page, filterText, filterOrderId, filterStatus) => {
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
        filterStatus: filterStatus.trim()
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

export const payOrder = async (id, payment_date) => {
  try {
    const response = await axios.put(`${API_URL}/orders/pay/${id}`, { payment_date }, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    alert(error);
    throw new Error('Failed to update order');
  }
};

export const dispatchOrder = async (id, dispatch_date) => {
  try {
    const response = await axios.put(`${API_URL}/orders/dispatch/${id}`, { dispatch_date }, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    alert(error);
    throw new Error('Failed to update order');
  }
};

export const cancelOrder = async (id, cancelled_date) => {
  try {
    const response = await axios.put(`${API_URL}/orders/cancel/${id}`, { cancelled_date }, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    alert(error);
    throw new Error('Failed to update order');
  }
};

export const returnOrder = async (id, returned_date) => {
  try {
    const response = await axios.put(`${API_URL}/orders/return/${id}`, { returned_date }, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    alert(error);
    throw new Error('Failed to update order');
  }
};