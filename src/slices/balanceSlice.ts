import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IIncome, IExpense, ISavings } from "../types";

interface BalanceState {
  amount: number;
}

const initialState: BalanceState = {
  amount: 0, // Initial available balance
};

const balanceSlice = createSlice({
  name: "balance",
  initialState,
  reducers: {
    // Action to set available balance
    setAvailableBalance(state, action: PayloadAction<number>) {
      state.amount = action.payload;
    },
    // Action to update available balance based on income, expenses, and savings
    calculateAvailableBalance(
      state,
      action: PayloadAction<{
        income: IIncome[];
        expenses: IExpense[];
        savings: ISavings[];
      }>
    ) {
      const totalIncome = action.payload.income.length
        ? action.payload.income.reduce((sum, curr) => sum + curr.amount, 0)
        : 0;
      const totalExpenses = action.payload.expenses.length
        ? action.payload.expenses.reduce((sum, curr) => sum + curr.amount, 0)
        : 0;
      const totalSavings = action.payload.savings.length
        ? action.payload.savings.reduce((sum, curr) => sum + curr.amount, 0)
        : 0;

      // Update available balance in the store
      state.amount = totalIncome - totalExpenses - totalSavings;
    },
  },
});

export const { setAvailableBalance, calculateAvailableBalance } =
  balanceSlice.actions;
export default balanceSlice.reducer;
