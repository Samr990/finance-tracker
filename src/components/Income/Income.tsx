import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addIncome } from "../../slices/incomeSlice";
import { IIncome } from "../../types";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./Income.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Income: React.FC = () => {
  const [formData, setFormData] = useState({ source: "", amount: "" });

  const dispatch = useAppDispatch();
  const incomes = useAppSelector((state) => state.income);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddIncome = () => {
    if (!formData.source.trim() || !formData.amount) return;

    const newIncome: IIncome = {
      id: Date.now().toString(),
      source: formData.source.trim(),
      amount: parseFloat(formData.amount),
    };
    dispatch(addIncome(newIncome));
    setFormData({ source: "", amount: "" });
  };

  // Prepare data for the Pie Chart
  const incomeSources = [...new Set(incomes.map((income) => income.source))];
  const chartData = {
    labels: incomeSources,
    datasets: [
      {
        label: "Income Distribution",
        data: incomeSources.map((source) =>
          incomes
            .filter((income) => income.source === source)
            .reduce((sum, curr) => sum + curr.amount, 0)
        ),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="income-container">
      <h2>Income</h2>
      <ul>
        {incomes.map(({ id, source, amount }) => (
          <li key={id}>
            {source}: ${amount.toFixed(2)}
          </li>
        ))}
      </ul>
      <input
        type="text"
        name="source"
        placeholder="Source"
        value={formData.source}
        onChange={handleChange}
      />
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
      />
      <button
        className="income-bt"
        onClick={handleAddIncome}
        disabled={!formData.source || !formData.amount}
      >
        Add Income
      </button>

      <div className="chart-container">
        <h3>Income Distribution</h3>
        <Pie data={chartData} />
      </div>
    </div>
  );
};

export default Income;
