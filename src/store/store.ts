import { configureStore } from "@reduxjs/toolkit";
import incomeReducer from "../slices/incomeSlice";
import expenseReducer from "../slices/expenseSlice";

import savingsReducer from "../slices/savingsSlice";
import balanceReducer from "../slices/balanceSlice";
export const store = configureStore({
  reducer: {
    income: incomeReducer,
    expense: expenseReducer,
    savings: savingsReducer,
    balance: balanceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
