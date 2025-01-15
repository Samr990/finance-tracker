import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IExpense } from "../types"; // Adjust the path

interface ExpenseState {
  expenseItems: IExpense[];
  totalExpense: number;
}

const initialState: ExpenseState = {
  expenseItems: [],
  totalExpense: 0,
};

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<IExpense>) => {
      state.expenseItems.push(action.payload);
      state.totalExpense += action.payload.amount;
    },
    removeExpense: (state, action: PayloadAction<string>) => {
      const index = state.expenseItems.findIndex(
        (expense: { id: string }) => expense.id === action.payload
      );
      if (index !== -1) {
        state.totalExpense -= state.expenseItems[index].amount;
        state.expenseItems.splice(index, 1);
      }
    },
  },
});

export const { addExpense, removeExpense } = expenseSlice.actions;
export default expenseSlice.reducer;
