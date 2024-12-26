import axios from 'axios';
import { API_URL } from '../common/constants';

export const getProducts = async (page, filterText) => {
  const limit = 10;
  try {
    const response = await axios.get(`${API_URL}/api/products/`, {
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
