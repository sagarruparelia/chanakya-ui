import axios from 'axios';
import { config } from '@/constants/config';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      error.message = message;
    } else if (error.request) {
      // Request made but no response
      error.message = 'Unable to connect to server';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
