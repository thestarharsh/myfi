import { Budget, CreateBudgetDto, UpdateBudgetDto } from '@finance-app/shared';
import apiClient from './api.client';

export const getBudgets = async (): Promise<Budget[]> => {
  const response = await apiClient.instance.get<{ success: boolean; data: Budget[] }>('/budgets');
  return response.data.data;
};

export const getBudget = async (id: string): Promise<Budget> => {
  const response = await apiClient.instance.get<{ success: boolean; data: Budget }>(
    `/budgets/${id}`
  );
  return response.data.data;
};

export const createBudget = async (budgetData: CreateBudgetDto): Promise<Budget> => {
  const response = await apiClient.instance.post<{ success: boolean; data: Budget }>(
    '/budgets',
    budgetData
  );
  return response.data.data;
};

export const updateBudget = async (id: string, budgetData: UpdateBudgetDto): Promise<Budget> => {
  const response = await apiClient.instance.put<{ success: boolean; data: Budget }>(
    `/budgets/${id}`,
    budgetData
  );
  return response.data.data;
};

export const deleteBudget = async (id: string): Promise<void> => {
  await apiClient.instance.delete(`/budgets/${id}`);
};


