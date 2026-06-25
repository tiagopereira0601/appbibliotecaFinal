import axios, { AxiosInstance } from 'axios';
import { Platform } from 'react-native';

/**
 * API Configuration for iBook Backend (JSON Server)
 * 
 * Web: http://localhost:3001
 * Android Device: http://<LAN_IP>:3001 or http://10.0.2.2:3001 (emulator)
 * iOS Device: http://<LAN_IP>:3001 or http://localhost:3001 (simulator)
 */

// Configure your LAN IP here for physical devices
const LAN_IP = process.env.EXPO_PUBLIC_LAN_IP || ""; // e.g., "192.168.0.100"

const API_URL = Platform.OS === 'web'
  ? `http://localhost:3001`
  : Platform.OS === 'android'
    ? (LAN_IP ? `http://${LAN_IP}:3001` : `http://10.0.2.2:3001`)
    : (LAN_IP ? `http://${LAN_IP}:3001` : 'http://localhost:3001');

console.log(`[iBook API] Platform: ${Platform.OS}`);
console.log(`[iBook API] API URL: ${API_URL}`);
console.log(`[iBook API] LAN_IP: ${LAN_IP || 'not configured'}`);

// Create Axios instance with timeout and headers
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`[iBook API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[iBook API] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[iBook API] Response: ${response.status} ${response.statusText}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`[iBook API] Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('[iBook API] No response from server:', error.request);
    } else {
      console.error('[iBook API] Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export { api, API_URL, LAN_IP };

