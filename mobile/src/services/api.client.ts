import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          const refreshToken = await SecureStore.getItemAsync('refreshToken');
          if (refreshToken) {
            try {
              const response = await axios.post(`${API_URL}/auth/refresh`, {
                refreshToken,
              });
              const { accessToken } = response.data.data;
              await SecureStore.setItemAsync('accessToken', accessToken);
              // Retry original request
              if (error.config) {
                error.config.headers.Authorization = `Bearer ${accessToken}`;
                return this.client.request(error.config);
              }
            } catch (refreshError) {
              // Refresh failed, clear tokens and redirect to login
              await SecureStore.deleteItemAsync('accessToken');
              await SecureStore.deleteItemAsync('refreshToken');
              return Promise.reject(refreshError);
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  get instance(): AxiosInstance {
    return this.client;
  }
}

export default new ApiClient();


