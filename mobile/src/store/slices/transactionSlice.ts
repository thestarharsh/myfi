import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, CreateTransactionDto, UpdateTransactionDto } from '@finance-app/shared';
import * as transactionService from '../../services/transaction.service';

interface TransactionState {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const initialState: TransactionState = {
  transactions: [],
  selectedTransaction: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (params?: { page?: number; limit?: number; accountId?: string }) => {
    return await transactionService.getTransactions(params);
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (transactionData: CreateTransactionDto) => {
    return await transactionService.createTransaction(transactionData);
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/update',
  async ({ id, data }: { id: string; data: UpdateTransactionDto }) => {
    return await transactionService.updateTransaction(id, data);
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async (id: string) => {
    await transactionService.deleteTransaction(id);
    return id;
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setSelectedTransaction: (state, action: PayloadAction<Transaction | null>) => {
      state.selectedTransaction = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
        if (state.selectedTransaction?.id === action.payload.id) {
          state.selectedTransaction = action.payload;
        }
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter((t) => t.id !== action.payload);
        if (state.selectedTransaction?.id === action.payload) {
          state.selectedTransaction = null;
        }
      });
  },
});

export const { setSelectedTransaction, clearError } = transactionSlice.actions;
export default transactionSlice.reducer;


