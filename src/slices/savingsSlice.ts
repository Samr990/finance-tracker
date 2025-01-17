import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISavings } from "../types";

interface SavingsState {
  savingsGoal: string;
  savings: ISavings[];
}

const initialState: SavingsState = {
  savingsGoal: "",
  savings: generateRandomSavingsData(),
};

// Function to generate random savings data for each month
function generateRandomSavingsData(): ISavings[] {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months.map((month, index) => {
    const randomAmount = parseFloat((Math.random() * 200 + 50).toFixed(2)); // Random value between 50 and 250
    return {
      id: `savings-${index + 1}`, // Generate a unique ID for each savings entry
      month: month,
      amount: randomAmount,
    };
  });
}

const savingsSlice = createSlice({
  name: "savings",
  initialState,
  reducers: {
    addSavings(state, action: PayloadAction<ISavings>) {
      state.savings.push(action.payload); // Add savings entry
    },
    setSavingsGoal(state, action: PayloadAction<string>) {
      state.savingsGoal = action.payload; // Set savings goal
    },
    resetData(state) {
      state.savings = [];
      state.savingsGoal = "";
    },
  },
});

// Selector to calculate total savings
export const selectTotalSavings = (state: { savings: SavingsState }) => {
  return state.savings.savings.reduce(
    (total, savingsItem) => total + savingsItem.amount,
    0
  );
};

// Export actions
export const { addSavings, setSavingsGoal, resetData } = savingsSlice.actions;

// Export the reducer
export default savingsSlice.reducer;
