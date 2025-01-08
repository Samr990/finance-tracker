import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Income } from "../types";

const initialState: Income[] = [];

const incomeSlice = createSlice({
  name: "income",
  initialState,
  reducers: {
    addIncome(state, action: PayloadAction<Income>) {
      state.push(action.payload);
    },
  },
});

export const { addIncome } = incomeSlice.actions;
export default incomeSlice.reducer;
