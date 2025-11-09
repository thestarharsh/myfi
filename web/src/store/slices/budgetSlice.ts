import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Budget, CreateBudgetDto, UpdateBudgetDto } from '@finance-app/shared';
import * as budgetService from '../../services/budget.service';

interface BudgetState {
  budgets: Budget[];
  selectedBudget: Budget | null;
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  budgets: [],
  selectedBudget: null,
  loading: false,
  error: null,
};

export const fetchBudgets = createAsyncThunk('budgets/fetchAll', async () => {
  return await budgetService.getBudgets();
});

export const createBudget = createAsyncThunk('budgets/create', async (budgetData: CreateBudgetDto) => {
  return await budgetService.createBudget(budgetData);
});

export const updateBudget = createAsyncThunk(
  'budgets/update',
  async ({ id, data }: { id: string; data: UpdateBudgetDto }) => {
    return await budgetService.updateBudget(id, data);
  }
);

export const deleteBudget = createAsyncThunk('budgets/delete', async (id: string) => {
  await budgetService.deleteBudget(id);
  return id;
});

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    setSelectedBudget: (state, action: PayloadAction<Budget | null>) => {
      state.selectedBudget = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch budgets';
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.budgets.push(action.payload);
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        const index = state.budgets.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
        if (state.selectedBudget?.id === action.payload.id) {
          state.selectedBudget = action.payload;
        }
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.budgets = state.budgets.filter((b) => b.id !== action.payload);
        if (state.selectedBudget?.id === action.payload) {
          state.selectedBudget = null;
        }
      });
  },
});

export const { setSelectedBudget, clearError } = budgetSlice.actions;
export default budgetSlice.reducer;


