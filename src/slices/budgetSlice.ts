import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBudget } from "../types";

const initialState: IBudget[] = [];

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    setBudget(state, action: PayloadAction<IBudget[]>) {
      return action.payload;
    },
  },
});

export const { setBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
