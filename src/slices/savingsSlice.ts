import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISavings } from "../types";

const initialState: ISavings = {
  total: 0,
  goal: "",
};

const savingsSlice = createSlice({
  name: "savings",
  initialState,
  reducers: {
    updateSavings(state, action: PayloadAction<ISavings>) {
      state.total = action.payload.total;
      state.goal = action.payload.goal;
    },
  },
});

export const { updateSavings } = savingsSlice.actions;
export default savingsSlice.reducer;
