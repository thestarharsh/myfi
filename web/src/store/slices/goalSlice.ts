import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Goal, CreateGoalDto, UpdateGoalDto } from '@finance-app/shared';
import * as goalService from '../../services/goal.service';

interface GoalState {
  goals: Goal[];
  selectedGoal: Goal | null;
  loading: boolean;
  error: string | null;
}

const initialState: GoalState = {
  goals: [],
  selectedGoal: null,
  loading: false,
  error: null,
};

export const fetchGoals = createAsyncThunk('goals/fetchAll', async () => {
  return await goalService.getGoals();
});

export const createGoal = createAsyncThunk('goals/create', async (goalData: CreateGoalDto) => {
  return await goalService.createGoal(goalData);
});

export const updateGoal = createAsyncThunk(
  'goals/update',
  async ({ id, data }: { id: string; data: UpdateGoalDto }) => {
    return await goalService.updateGoal(id, data);
  }
);

export const deleteGoal = createAsyncThunk('goals/delete', async (id: string) => {
  await goalService.deleteGoal(id);
  return id;
});

const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    setSelectedGoal: (state, action: PayloadAction<Goal | null>) => {
      state.selectedGoal = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch goals';
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload);
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
        if (state.selectedGoal?.id === action.payload.id) {
          state.selectedGoal = action.payload;
        }
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((g) => g.id !== action.payload);
        if (state.selectedGoal?.id === action.payload) {
          state.selectedGoal = null;
        }
      });
  },
});

export const { setSelectedGoal, clearError } = goalSlice.actions;
export default goalSlice.reducer;


