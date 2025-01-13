import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addExpense } from "../../slices/expenseSlice";
import { IExpense } from "../../types";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./Expense.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Expenses: React.FC = () => {
  const [formData, setFormData] = useState({ category: "", amount: "" });

  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expense);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding a new expense
  const handleAddExpense = () => {
    if (!formData.category.trim() || !formData.amount) return;

    const newExpense: IExpense = {
      id: Date.now().toString(),
      category: formData.category.trim(),
      amount: parseFloat(formData.amount),
    };
    dispatch(addExpense(newExpense));
    setFormData({ category: "", amount: "" });
  };

  // Group expenses by category and calculate totals per category
  const expenseCategoryTotals = useMemo(() => {
    return expenses.reduce((acc, { category, amount }) => {
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);
  }, [expenses]);

  // Prepare data for the Pie Chart
  const expenseCategories = Object.keys(expenseCategoryTotals);
  const chartData = {
    labels: expenseCategories,
    datasets: [
      {
        label: "Expense Distribution",
        data: expenseCategories.map(
          (category) => expenseCategoryTotals[category]
        ),
        backgroundColor: [
          "#FF5733", // red
          "#33FF57", // green
          "#3357FF", // blue
          "#FF33A8", // pink
          "#57FF33", // light green
          "#A833FF", // purple
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="expense-container">
      <h2>Expenses</h2>
      <ul>
        {expenses.map(({ id, category, amount }) => (
          <li key={id}>
            {category}: ${amount.toFixed(2)}
          </li>
        ))}
      </ul>
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
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
        className="expense-bt"
        onClick={handleAddExpense}
        disabled={!formData.category || !formData.amount}
      >
        Add Expense
      </button>

      <div className="chart-container">
        <h3>Expense Distribution</h3>
        <Pie data={chartData} />
      </div>
    </div>
  );
};

export default Expenses;
