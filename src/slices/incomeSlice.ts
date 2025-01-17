import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IIncome } from "../types";

interface IncomeState {
  incomeItems: IIncome[];
  totalIncome: number;
}

const incomeSources = [
  "Salary",
  "Freelance",
  "Investment",
  "Business",
  "Other",
];

const initialState: IncomeState = {
  incomeItems: generateRandomIncomeData(),
  totalIncome: 0,
};

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
    const randomAmount = parseFloat((Math.random() * 1000 + 500).toFixed(2));
    const randomSource =
      incomeSources[Math.floor(Math.random() * incomeSources.length)];
    return {
      id: `income-${index + 1}`,
      month: month,
      amount: randomAmount,
      income_source: randomSource,
      date: new Date().toISOString(),
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
        Object.assign(incomeToUpdate, updatedIncome);
        state.totalIncome = state.incomeItems.reduce(
          (sum, income) => sum + income.amount,
          0
        );
      }
    },
    resetData(state) {
      state.incomeItems = [];
      state.totalIncome = 0;
    },
  },
});

export const { addIncome, removeIncome, updateIncome, resetData } =
  incomeSlice.actions;
export default incomeSlice.reducer;
