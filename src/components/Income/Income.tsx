import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addIncome } from "../../slices/incomeSlice";
import { IIncome } from "../../types";
import "./Income.css";

const Income: React.FC = () => {
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState(0);

  const dispatch = useAppDispatch();
  const incomes = useAppSelector((state) => state.income);

  const handleAddIncome = () => {
    const newIncome: IIncome = {
      id: Date.now().toString(),
      source,
      amount,
    };
    dispatch(addIncome(newIncome));
    setSource("");
    setAmount(0);
  };

  return (
    <div>
      <h2>Income</h2>
      <ul>
        {incomes.map((income) => (
          <li key={income.id}>
            {income.source}: ${income.amount}
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Source"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button className="income-bt" onClick={handleAddIncome}>
        Add Income
      </button>
    </div>
  );
};

export default Income;
