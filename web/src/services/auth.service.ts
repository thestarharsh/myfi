import { AuthResponse, LoginDto, CreateUserDto } from '@finance-app/shared';
import apiClient from './api.client';

export const login = async (credentials: LoginDto): Promise<AuthResponse> => {
  const response = await apiClient.instance.post<{ success: boolean; data: AuthResponse }>(
    '/auth/login',
    credentials
  );
  return response.data.data;
};

export const register = async (userData: CreateUserDto): Promise<AuthResponse> => {
  const response = await apiClient.instance.post<{ success: boolean; data: AuthResponse }>(
    '/auth/register',
    userData
  );
  return response.data.data;
};

export const logout = async (): Promise<void> => {
  // Clear tokens from localStorage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};


