import { AuthResponse, LoginDto, CreateUserDto } from '@finance-app/shared';
import apiClient from './api.client';
import * as SecureStore from 'expo-secure-store';

export const login = async (credentials: LoginDto): Promise<AuthResponse> => {
  const response = await apiClient.instance.post<{ success: boolean; data: AuthResponse }>(
    '/auth/login',
    credentials
  );
  const { accessToken, refreshToken, user } = response.data.data;
  await SecureStore.setItemAsync('accessToken', accessToken);
  await SecureStore.setItemAsync('refreshToken', refreshToken);
  return response.data.data;
};

export const register = async (userData: CreateUserDto): Promise<AuthResponse> => {
  const response = await apiClient.instance.post<{ success: boolean; data: AuthResponse }>(
    '/auth/register',
    userData
  );
  const { accessToken, refreshToken, user } = response.data.data;
  await SecureStore.setItemAsync('accessToken', accessToken);
  await SecureStore.setItemAsync('refreshToken', refreshToken);
  return response.data.data;
};

export const logout = async (): Promise<void> => {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
};


