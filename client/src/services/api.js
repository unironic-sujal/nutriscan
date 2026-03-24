import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Look up a product by barcode
 */
export const getProductByBarcode = async (barcode) => {
  const response = await api.get(`/product/${barcode}`);
  return response.data;
};

/**
 * Search products by name
 */
export const searchProducts = async (query) => {
  const response = await api.get('/search', { params: { q: query } });
  return response.data;
};

/**
 * Get recently scanned products
 */
export const getRecentProducts = async () => {
  const response = await api.get('/products/recent');
  return response.data;
};

export default api;
