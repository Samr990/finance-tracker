import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IIncome } from "../types";

interface IncomeState {
  incomeItems: IIncome[];
  totalIncome: number;
}

const initialState: IncomeState = {
  incomeItems: generateRandomIncomeData(),
  totalIncome: 0,
};

// Function to generate random income data for each month
function generateRandomIncomeData(): IIncome[] {
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
    const randomAmount = parseFloat((Math.random() * 1000 + 500).toFixed(2)); // Random value between 500 and 1500
    return {
      id: `income-${index + 1}`, // Generate a unique ID for each income
      month: month,
      amount: randomAmount,
      income_source: "Random Source", // Add a default income source
      date: new Date().toISOString(), // Add the current date
    };
  });
}

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
    updateIncome(
      state,
      action: PayloadAction<{
        id: string;
        updatedIncome: Partial<IIncome>;
      }>
    ) {
      const { id, updatedIncome } = action.payload;
      const incomeToUpdate = state.incomeItems.find(
        (income) => income.id === id
      );
      if (incomeToUpdate) {
        // Update only the changed fields
        Object.assign(incomeToUpdate, updatedIncome);

        // Recalculate totalIncome after update
        state.totalIncome = state.incomeItems.reduce(
          (sum, income) => sum + income.amount,
          0
        );
      }
    },
    // New reset action to clear all data
    resetData(state) {
      state.incomeItems = []; // Clear income items
      state.totalIncome = 0; // Reset total income to 0
    },
  },
});

export const { addIncome, removeIncome, updateIncome, resetData } =
  incomeSlice.actions;
export default incomeSlice.reducer;
