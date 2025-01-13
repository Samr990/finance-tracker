import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISavings } from "../types";

const initialState: ISavings[] = [];

const savingsSlice = createSlice({
  name: "savings",
  initialState,
  reducers: {
    addSavings(state, action: PayloadAction<ISavings>) {
      state.push(action.payload);
    },
  },
});

export const { addSavings } = savingsSlice.actions;
export default savingsSlice.reducer;
