import axios from 'axios';

// ======================= CONFIGURATION =======================

// Base URL from environment variable or fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create Axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token from localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Generic API request wrapper with error handling
const apiRequest = async (method, endpoint, data = null, config = {}) => {
  try {
    const response = await API.request({
      method,
      url: endpoint,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    // Handle validation or backend error messages gracefully
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      const messages = error.response.data.errors.map((e) => e.message).join(', ');
      throw new Error(messages);
    }
    throw new Error(error.response?.data?.message || 'Something went wrong with API');
  }
};

// Helper to get token if needed manually
const getToken = () => localStorage.getItem('token');

//
// ======================= AUTHENTICATION API =======================
//
export const authAPI = {
  register: (userData) => apiRequest('POST', '/auth/register', userData),

  login: (credentials) => apiRequest('POST', '/auth/login', credentials),

  getProfile: (token = getToken()) =>
    apiRequest('GET', '/auth/me', null, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  forgotPassword: (email) => apiRequest('POST', '/auth/forgot-password', { email }),

  resetPassword: (token, password) =>
    apiRequest('POST', `/auth/reset-password/${token}`, { password }),
};

//
// ======================= TRANSACTIONS API =======================
//
export const transactionAPI = {
  // Get all (income + expense)
  getAll: () => apiRequest('GET', '/transactions'),

  // Add income
  addIncome: (data) =>
    apiRequest('POST', '/transactions', { ...data, type: 'income' }),

  // Add expense
  addExpense: (data) =>
    apiRequest('POST', '/transactions', { ...data, type: 'expense' }),

  // Update a transaction
  update: (id, data) => apiRequest('PUT', `/transactions/${id}`, data),

  // Delete a transaction
  remove: (id) => apiRequest('DELETE', `/transactions/${id}`),
};

//
// ======================= BUDGET API =======================
//
export const budgetAPI = {
  getAll: () => apiRequest('GET', '/budgets'),
  create: (data) => apiRequest('POST', '/budgets', data),
  update: (id, data) => apiRequest('PUT', `/budgets/${id}`, data),
  remove: (id) => apiRequest('DELETE', `/budgets/${id}`),
};

//
// ======================= HEALTH CHECK =======================
//
export const healthCheck = () => apiRequest('GET', '/health');

//
// ======================= EXPORT DEFAULT =======================
//
export default API;
