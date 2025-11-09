import { Goal, CreateGoalDto, UpdateGoalDto } from '@finance-app/shared';
import apiClient from './api.client';

export const getGoals = async (): Promise<Goal[]> => {
  const response = await apiClient.instance.get<{ success: boolean; data: Goal[] }>('/goals');
  return response.data.data;
};

export const getGoal = async (id: string): Promise<Goal> => {
  const response = await apiClient.instance.get<{ success: boolean; data: Goal }>(`/goals/${id}`);
  return response.data.data;
};

export const createGoal = async (goalData: CreateGoalDto): Promise<Goal> => {
  const response = await apiClient.instance.post<{ success: boolean; data: Goal }>(
    '/goals',
    goalData
  );
  return response.data.data;
};

export const updateGoal = async (id: string, goalData: UpdateGoalDto): Promise<Goal> => {
  const response = await apiClient.instance.put<{ success: boolean; data: Goal }>(
    `/goals/${id}`,
    goalData
  );
  return response.data.data;
};

export const deleteGoal = async (id: string): Promise<void> => {
  await apiClient.instance.delete(`/goals/${id}`);
};

