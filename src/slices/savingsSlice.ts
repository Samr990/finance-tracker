// In savingsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISavings } from "../types";

interface SavingsState {
  savingsGoal: string;
  savings: ISavings[];
}

const initialState: SavingsState = {
  savingsGoal: "",
  savings: [],
};

const savingsSlice = createSlice({
  name: "savings",
  initialState,
  reducers: {
    addSavings(state, action: PayloadAction<ISavings>) {
      state.savings.push(action.payload); // Add savings entry
    },
    setSavingsGoal(state, action: PayloadAction<string>) {
      state.savingsGoal = action.payload; // Set savings goal
    },
  },
});

// Selector to calculate total savings
export const selectTotalSavings = (state: { savings: SavingsState }) => {
  return state.savings.savings.reduce(
    (total, savingsItem) => total + savingsItem.amount,
    0
  );
};

// Export actions
export const { addSavings, setSavingsGoal } = savingsSlice.actions;

// Export the reducer
export default savingsSlice.reducer;
