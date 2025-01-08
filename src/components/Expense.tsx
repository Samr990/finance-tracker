import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { addExpense } from "../slices/expenseSlice";
import { IExpense } from "../types";

const Expenses: React.FC = () => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);

  const dispatch = useAppDispatch();
  const expenses: IExpense[] = useAppSelector(
    (state: { expense: IExpense[] }) => state.expense
  );

  const handleAddExpense = () => {
    const newExpense: IExpense = {
      id: Date.now().toString(),
      category,
      amount,
    };
    dispatch(addExpense(newExpense));
    setCategory("");
    setAmount(0);
  };

  return (
    <div>
      <h2>Expenses</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.category}: ${expense.amount}
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button onClick={handleAddExpense}>Add Expense</button>
    </div>
  );
};

export default Expenses;
