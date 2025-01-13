import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IIncome } from "../types";

interface IncomeState {
  incomeItems: IIncome[];
  totalIncome: number;
}

const initialState: IncomeState = {
  incomeItems: [],
  totalIncome: 0,
};

const incomeSlice = createSlice({
  name: "income",
  initialState,
  reducers: {
    addIncome(state, action: PayloadAction<IIncome>) {
      state.incomeItems.push(action.payload);
      state.totalIncome += action.payload.amount;
    },
    removeIncome(state, action: PayloadAction<string>) {
      const incomeToRemove = state.incomeItems.find(
        (income) => income.id === action.payload
      );
      if (incomeToRemove) {
        state.totalIncome -= incomeToRemove.amount;
        state.incomeItems = state.incomeItems.filter(
          (income) => income.id !== action.payload
        );
      }
    },
  },
});

export const { addIncome, removeIncome } = incomeSlice.actions;
export default incomeSlice.reducer;
