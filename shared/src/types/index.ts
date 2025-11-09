// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  country?: string;
  currency: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  country?: string;
  currency?: string;
  language?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Account Types
export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  CREDIT_CARD = 'CREDIT_CARD',
  INVESTMENT = 'INVESTMENT',
  CASH = 'CASH',
  OTHER = 'OTHER',
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccountDto {
  name: string;
  type: AccountType;
  balance: number;
  currency?: string;
}

export interface UpdateAccountDto {
  name?: string;
  type?: AccountType;
  balance?: number;
}

// Transaction Types
export enum TransactionCategory {
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  SHOPPING = 'SHOPPING',
  BILLS = 'BILLS',
  ENTERTAINMENT = 'ENTERTAINMENT',
  HEALTHCARE = 'HEALTHCARE',
  EDUCATION = 'EDUCATION',
  TRAVEL = 'TRAVEL',
  INVESTMENT = 'INVESTMENT',
  INCOME = 'INCOME',
  OTHER = 'OTHER',
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description?: string;
  isNeed: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionDto {
  accountId: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description?: string;
  isNeed: boolean;
  date: Date;
}

export interface UpdateTransactionDto {
  accountId?: string;
  amount?: number;
  type?: TransactionType;
  category?: TransactionCategory;
  description?: string;
  isNeed?: boolean;
  date?: Date;
}

// Goal Types
export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGoalDto {
  name: string;
  targetAmount: number;
  targetDate: Date;
  currency?: string;
}

export interface UpdateGoalDto {
  name?: string;
  targetAmount?: number;
  currentAmount?: number;
  targetDate?: Date;
}

// Budget Types
export enum BudgetPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export interface Budget {
  id: string;
  userId: string;
  category: TransactionCategory;
  amount: number;
  period: BudgetPeriod;
  spent: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBudgetDto {
  category: TransactionCategory;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  currency?: string;
}

export interface UpdateBudgetDto {
  category?: TransactionCategory;
  amount?: number;
  period?: BudgetPeriod;
  startDate?: Date;
  endDate?: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Common Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface DateRangeParams {
  startDate?: Date;
  endDate?: Date;
}


