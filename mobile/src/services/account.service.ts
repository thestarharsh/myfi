import { Account, CreateAccountDto, UpdateAccountDto } from '@finance-app/shared';
import apiClient from './api.client';

export const getAccounts = async (): Promise<Account[]> => {
  const response = await apiClient.instance.get<{ success: boolean; data: Account[] }>(
    '/accounts'
  );
  return response.data.data;
};

export const getAccount = async (id: string): Promise<Account> => {
  const response = await apiClient.instance.get<{ success: boolean; data: Account }>(
    `/accounts/${id}`
  );
  return response.data.data;
};

export const createAccount = async (accountData: CreateAccountDto): Promise<Account> => {
  const response = await apiClient.instance.post<{ success: boolean; data: Account }>(
    '/accounts',
    accountData
  );
  return response.data.data;
};

export const updateAccount = async (
  id: string,
  accountData: UpdateAccountDto
): Promise<Account> => {
  const response = await apiClient.instance.put<{ success: boolean; data: Account }>(
    `/accounts/${id}`,
    accountData
  );
  return response.data.data;
};

export const deleteAccount = async (id: string): Promise<void> => {
  await apiClient.instance.delete(`/accounts/${id}`);
};


