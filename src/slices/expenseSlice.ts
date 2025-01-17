import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IExpense } from "../types"; // Adjust the path

interface ExpenseState {
  expenseItems: IExpense[];
  totalExpense: number;
}

const initialState: ExpenseState = {
  expenseItems: generateRandomExpenseData(),
  totalExpense: 0,
};

// Function to generate random expense data for each month
function generateRandomExpenseData(): IExpense[] {
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

  const expenseCategories = [
    "Groceries",
    "Rent",
    "Utilities",
    "Entertainment",
    "Other",
  ];

  return months.map((month, index) => {
    const randomCategory =
      expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
    const randomAmount = parseFloat((Math.random() * 500 + 100).toFixed(2)); // Random value between 100 and 600
    return {
      id: `expense-${index + 1}`, // Generate a unique ID for each expense
      month: month,
      category: randomCategory,
      amount: randomAmount,
      date: new Date().toISOString(), // Add the current date as ISO string
    };
  });
}

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<IExpense>) => {
      state.expenseItems.push(action.payload);
      state.totalExpense += action.payload.amount;
    },
    removeExpense: (state, action: PayloadAction<string>) => {
      const index = state.expenseItems.findIndex(
        (expense: { id: string }) => expense.id === action.payload
      );
      if (index !== -1) {
        state.totalExpense -= state.expenseItems[index].amount;
        state.expenseItems.splice(index, 1);
      }
    },
    updateExpense: (
      state,
      action: PayloadAction<{
        id: string;
        updatedExpense: Partial<IExpense>;
      }>
    ) => {
      const { id, updatedExpense } = action.payload;
      const expenseToUpdate = state.expenseItems.find(
        (expense) => expense.id === id
      );
      if (expenseToUpdate) {
        // Update only the changed fields
        Object.assign(expenseToUpdate, updatedExpense);

        // Recalculate totalExpense after update
        state.totalExpense = state.expenseItems.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
      }
    },

    resetData(state) {
      state.expenseItems = [];
      state.totalExpense = 0;
    },
  },
});

export const { addExpense, removeExpense, updateExpense, resetData } =
  expenseSlice.actions;
export default expenseSlice.reducer;
