import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addIncome, removeIncome } from "../../slices/incomeSlice";
import { IIncome } from "../../types";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./Income.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Income: React.FC = () => {
  const [formData, setFormData] = useState({ amount: "", income_source: "" });

  const dispatch = useAppDispatch();
  const { incomeItems, totalIncome } = useAppSelector((state) => state.income);

  // List of fixed income sources
  const incomeSources = [
    "Salary",
    "Freelance",
    "Investment",
    "Business",
    "Other",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddIncome = () => {
    if (!formData.amount || !formData.income_source) return;

    const newIncome: IIncome = {
      id: Date.now().toString(),
      amount: parseFloat(formData.amount),
      income_source: formData.income_source,
    };
    dispatch(addIncome(newIncome));
    setFormData({ amount: "", income_source: "" });
  };

  const handleRemoveIncome = (id: string) => {
    dispatch(removeIncome(id));
  };

  // Prepare data for the Pie Chart
  const incomeCategories = [
    ...new Set(incomeItems.map((income) => income.income_source)),
  ];
  const chartData = {
    labels: incomeCategories,
    datasets: [
      {
        label: "Income Distribution",
        data: incomeCategories.map((income_source) =>
          incomeItems
            .filter((income) => income.income_source === income_source)
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
        {incomeItems.map(({ id, amount, income_source }) => (
          <li key={id}>
            {income_source}: ${amount.toFixed(2)}
            <button onClick={() => handleRemoveIncome(id)}>Remove</button>
          </li>
        ))}
      </ul>
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
      />
      <select
        name="income_source"
        value={formData.income_source}
        onChange={handleChange}
      >
        <option value="">Select Income Source</option>
        {incomeSources.map((income_source) => (
          <option key={income_source} value={income_source}>
            {income_source}
          </option>
        ))}
      </select>
      <button
        className="income-bt"
        onClick={handleAddIncome}
        disabled={!formData.amount || !formData.income_source}
      >
        Add Income
      </button>

      <h3>Total Income: ${totalIncome.toFixed(2)}</h3>

      <div className="chart-container">
        <h3>Income Distribution</h3>
        <Pie data={chartData} />
      </div>
    </div>
  );
};

export default Income;
