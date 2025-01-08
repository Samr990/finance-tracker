import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IExpense } from "../types";

const initialState: IExpense[] = [];

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    addExpense(state, action: PayloadAction<IExpense>) {
      state.push(action.payload);
    },
  },
});

export const { addExpense } = expenseSlice.actions;
export default expenseSlice.reducer;
