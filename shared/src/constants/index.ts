// Transaction Categories
export const TRANSACTION_CATEGORIES = [
  'FOOD',
  'TRANSPORT',
  'SHOPPING',
  'BILLS',
  'ENTERTAINMENT',
  'HEALTHCARE',
  'EDUCATION',
  'TRAVEL',
  'INVESTMENT',
  'INCOME',
  'OTHER',
] as const;

// Account Types
export const ACCOUNT_TYPES = [
  'CHECKING',
  'SAVINGS',
  'CREDIT_CARD',
  'INVESTMENT',
  'CASH',
  'OTHER',
] as const;

// Transaction Types
export const TRANSACTION_TYPES = ['INCOME', 'EXPENSE', 'TRANSFER'] as const;

// Budget Periods
export const BUDGET_PERIODS = [
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'YEARLY',
] as const;

// Supported Currencies
export const CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'AUD',
  'CAD',
  'CHF',
  'CNY',
  'INR',
  'BRL',
] as const;

// Supported Languages
export const LANGUAGES = ['en', 'es', 'fr', 'de', 'pt', 'zh', 'ja', 'hi'] as const;

// Default Currency
export const DEFAULT_CURRENCY = 'USD';

// Default Language
export const DEFAULT_LANGUAGE = 'en';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/profile',
  },
  ACCOUNTS: {
    LIST: '/accounts',
    CREATE: '/accounts',
    GET: '/accounts/:id',
    UPDATE: '/accounts/:id',
    DELETE: '/accounts/:id',
  },
  TRANSACTIONS: {
    LIST: '/transactions',
    CREATE: '/transactions',
    GET: '/transactions/:id',
    UPDATE: '/transactions/:id',
    DELETE: '/transactions/:id',
  },
  GOALS: {
    LIST: '/goals',
    CREATE: '/goals',
    GET: '/goals/:id',
    UPDATE: '/goals/:id',
    DELETE: '/goals/:id',
  },
  BUDGETS: {
    LIST: '/budgets',
    CREATE: '/budgets',
    GET: '/budgets/:id',
    UPDATE: '/budgets/:id',
    DELETE: '/budgets/:id',
  },
} as const;

// Pagination Defaults
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  DATETIME: 'MMM DD, YYYY HH:mm',
  TIME: 'HH:mm',
} as const;


