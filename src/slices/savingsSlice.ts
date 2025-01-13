import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISavings } from "../types";

interface SavingsState {
  savingsGoal: string;
  savings: ISavings[];
}

const initialState: SavingsState = {
  savingsGoal: "", // Initial savings goal is empty
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

// Export actions
export const { addSavings, setSavingsGoal } = savingsSlice.actions;

// Export the reducer
export default savingsSlice.reducer;
