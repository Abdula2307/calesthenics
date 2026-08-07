import axios from 'axios';


// Replachine's LAN IP (not localhost) so your phone can reac>
// Run `ipconfig` (Windows) to find it, e.g. 192.168.1.42;
const BASE_URL = 'https://calisthenics-backend.serveousercont>
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bea>
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export default apiClient;

