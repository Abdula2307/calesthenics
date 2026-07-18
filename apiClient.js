import axios from 'axios';

// Replace with your machine's LAN IP (not localhost) so your phone can reach it.
// Run `ipconfig` (Windows) to find it, e.g. 192.168.1.42
const BASE_URL = 'http://192.168.43.249:3000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export default apiClient;