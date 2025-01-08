export interface Income {
  id: string;
  source: string;
  amount: number;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
}

export interface Budget {
  category: string;
  amount: number;
}

export interface Savings {
  total: number;
  goal: string;
}
