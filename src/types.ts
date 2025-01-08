export interface IIncome {
  id: string;
  source: string;
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
  total: number;
  goal: string;
}
