import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Account, CreateAccountDto, UpdateAccountDto } from '@finance-app/shared';
import * as accountService from '../../services/account.service';

interface AccountState {
  accounts: Account[];
  selectedAccount: Account | null;
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  accounts: [],
  selectedAccount: null,
  loading: false,
  error: null,
};

export const fetchAccounts = createAsyncThunk('accounts/fetchAll', async () => {
  return await accountService.getAccounts();
});

export const createAccount = createAsyncThunk(
  'accounts/create',
  async (accountData: CreateAccountDto) => {
    return await accountService.createAccount(accountData);
  }
);

export const updateAccount = createAsyncThunk(
  'accounts/update',
  async ({ id, data }: { id: string; data: UpdateAccountDto }) => {
    return await accountService.updateAccount(id, data);
  }
);

export const deleteAccount = createAsyncThunk('accounts/delete', async (id: string) => {
  await accountService.deleteAccount(id);
  return id;
});

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setSelectedAccount: (state, action: PayloadAction<Account | null>) => {
      state.selectedAccount = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch accounts';
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.accounts.push(action.payload);
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        const index = state.accounts.findIndex((acc) => acc.id === action.payload.id);
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
        if (state.selectedAccount?.id === action.payload.id) {
          state.selectedAccount = action.payload;
        }
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter((acc) => acc.id !== action.payload);
        if (state.selectedAccount?.id === action.payload) {
          state.selectedAccount = null;
        }
      });
  },
});

export const { setSelectedAccount, clearError } = accountSlice.actions;
export default accountSlice.reducer;


