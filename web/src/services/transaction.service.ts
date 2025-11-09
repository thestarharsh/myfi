import {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  PaginatedResponse,
} from '@finance-app/shared';
import apiClient from './api.client';

export const getTransactions = async (params?: {
  page?: number;
  limit?: number;
  accountId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<PaginatedResponse<Transaction>> => {
  const response = await apiClient.instance.get<{
    success: boolean;
    data: Transaction[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>('/transactions', { params });
  return {
    data: response.data.data,
    total: response.data.pagination.total,
    page: response.data.pagination.page,
    limit: response.data.pagination.limit,
    totalPages: response.data.pagination.totalPages,
  };
};

export const getTransaction = async (id: string): Promise<Transaction> => {
  const response = await apiClient.instance.get<{ success: boolean; data: Transaction }>(
    `/transactions/${id}`
  );
  return response.data.data;
};

export const createTransaction = async (
  transactionData: CreateTransactionDto
): Promise<Transaction> => {
  const response = await apiClient.instance.post<{ success: boolean; data: Transaction }>(
    '/transactions',
    transactionData
  );
  return response.data.data;
};

export const updateTransaction = async (
  id: string,
  transactionData: UpdateTransactionDto
): Promise<Transaction> => {
  const response = await apiClient.instance.put<{ success: boolean; data: Transaction }>(
    `/transactions/${id}`,
    transactionData
  );
  return response.data.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await apiClient.instance.delete(`/transactions/${id}`);
};


