export interface IIncome {
  id: string;
  income_source: string;
  amount: number;
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
