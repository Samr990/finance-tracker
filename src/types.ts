export interface IIncome {
  id: string;
  amount: number;
  income_source: string;
  month: string; // New property for the date of income
}

export interface IExpense {
  id: string;
  category: string;
  amount: number;
}

export interface IBudget {
  category: string;
  amount: number;
}

export interface ISavings {
  id: string;
  category: string;
  amount: number;
}
