import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IExpense } from "../types";

// Define the initial state as an array of expenses
const initialState: IExpense[] = [];

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    // Add a new expense to the state
    addExpense(state, action: PayloadAction<IExpense>) {
      state.push(action.payload);
    },

    // Remove an expense by ID
    removeExpense(state, action: PayloadAction<string>) {
      return state.filter((expense) => expense.id !== action.payload);
    },

    // Update an expense by ID
    updateExpense(
      state,
      action: PayloadAction<{ id: string; updatedExpense: Partial<IExpense> }>
    ) {
      const { id, updatedExpense } = action.payload;
      const expenseIndex = state.findIndex((expense) => expense.id === id);
      if (expenseIndex !== -1) {
        state[expenseIndex] = { ...state[expenseIndex], ...updatedExpense };
      }
    },
  },
});

export const { addExpense, removeExpense, updateExpense } =
  expenseSlice.actions;
export default expenseSlice.reducer;
