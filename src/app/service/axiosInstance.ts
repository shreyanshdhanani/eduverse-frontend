import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3020/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // important if we ever use cookies for refresh token
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    const token = adminToken || authToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to unwrap { success: true, data: ... }
axiosInstance.interceptors.response.use(
  (response) => {
    // If the response follows the { success, data } structure, return just the data.
    if (response.data && response.data.success === true && response.data.data !== undefined) {
      return response.data.data; // Return ONLY the payload
    }
    return response.data; // Return the whole body if it doesn't match the wrapper
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
