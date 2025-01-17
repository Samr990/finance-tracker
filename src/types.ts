export interface IIncome {
  id: string;
  amount: number;
  income_source: string;
  month: string; // New property for the date of income
  date: string;
}

export interface IExpense {
  id: string;
  category: string;
  amount: number;
  month: string;
  date: string;
}

export interface IBudget {
  id: string;
  category: string;
  amount: number;
  month: string;
}

export interface IBalance {
  availableBalance: number;
}

export interface ISavings {
  id: string;
  amount: number;
  month: string;
}
