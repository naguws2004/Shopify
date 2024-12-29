import axios from 'axios';
import { API_URL_PRODUCTS } from '../common/constants';

export const getProducts = async (token, page, filterText) => {
  const limit = 8;
  try {
    const response = await axios.get(`${API_URL_PRODUCTS}/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      params: {
        page,
        limit,
        filterText: filterText.trim(),
        includeQty: true
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
    throw new Error('Failed to fetch products');
  }
};

export const getProduct = async (token, id) => {
  try {
    const response = await axios.get(`${API_URL_PRODUCTS}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch product');
  }
};