import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IIncome } from "../types";

const initialState: IIncome[] = [];

const incomeSlice = createSlice({
  name: "income",
  initialState,
  reducers: {
    addIncome(state, action: PayloadAction<IIncome>) {
      state.push(action.payload);
    },
  },
});

export const { addIncome } = incomeSlice.actions;
export default incomeSlice.reducer;
