import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addExpense, removeExpense } from "../../slices/expenseSlice";
import { IExpense } from "../../types";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import "./Expense.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Expense: React.FC = () => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
  });
  const [selectedMonth, setSelectedMonth] = useState<string>("January");

  const dispatch = useAppDispatch();
  const { expenseItems, totalExpense } = useAppSelector(
    (state) => state.expense
  );

  const expenseCategories = [
    "Food & Drinks",
    "Transport",
    "Rent",
    "Utilities",
    "Entertainment",
    "Other",
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExpense = () => {
    if (!formData.amount || !formData.category) return;

    const newExpense: IExpense = {
      id: Date.now().toString(),
      category: formData.category,
      amount: parseFloat(formData.amount),
      month: selectedMonth,
    };

    dispatch(addExpense(newExpense));
    setFormData({ amount: "", category: "" });
  };

  const handleRemoveExpense = (id: string) => {
    dispatch(removeExpense(id));
  };

  const handleMonthSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  const filteredExpenseItems = useMemo(
    () => expenseItems.filter((expense) => expense.month === selectedMonth),
    [expenseItems, selectedMonth]
  );

  const expenseCategoriesSet = [
    ...new Set(filteredExpenseItems.map((expense) => expense.category)),
  ];

  const pieChartData = {
    labels: expenseCategoriesSet,
    datasets: [
      {
        label: `Expense Distribution for ${selectedMonth}`,
        data: expenseCategoriesSet.map((category) =>
          filteredExpenseItems
            .filter((expense) => expense.category === category)
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

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.label}: $${tooltipItem.raw.toFixed(2)}`;
          },
        },
      },
    },
  };

  const monthlyExpenseData = months.reduce((acc, month) => {
    acc[month] = expenseItems
      .filter((expense) => expense.month === month)
      .reduce((sum, curr) => sum + curr.amount, 0);
    return acc;
  }, {} as Record<string, number>);

  const barChartData = {
    labels: months,
    datasets: [
      {
        label: "Monthly Expenses",
        data: months.map((month) => monthlyExpenseData[month]),
        backgroundColor: "#FF6384",
      },
    ],
  };

  return (
    <div className="expense-container">
      <div className="expense-list-container">
        <h2>Expenses</h2>
        <div className="month-selection-container">
          <select value={selectedMonth} onChange={handleMonthSelection}>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {expenseCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
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
            disabled={!formData.amount || !formData.category}
          >
            Add Expense
          </button>
        </div>

        <h3>Total Expenses: ${totalExpense.toFixed(2)}</h3>

        <ul>
          {filteredExpenseItems.map(({ id, amount, category, month }) => (
            <li key={id}>
              {month} - {category}: ${amount.toFixed(2)}
              <button
                onClick={() => handleRemoveExpense(id)}
                className="ml-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 focus:outline-none"
                aria-label="Remove"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="eChart-container">
        <div className="top-right">
          <div className="expense-category bg-red-200">
            {expenseCategories.map((category) => {
              const totalForCategory = filteredExpenseItems
                .filter((expense) => expense.category === category)
                .reduce((sum, curr) => sum + curr.amount, 0);

              return (
                <div
                  key={category}
                  className={`expense-box ${
                    category === "Food & Drinks"
                      ? "bg-pink-200"
                      : category === "Transport"
                      ? "bg-blue-200"
                      : category === "Rent"
                      ? "bg-green-200"
                      : category === "Utilities"
                      ? "bg-yellow-200"
                      : category === "Entertainment"
                      ? "bg-purple-200"
                      : "bg-gray-200"
                  }`}
                >
                  <span>{category}</span>
                  <span>${totalForCategory.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
          <div className="expense-chart">
            <h3>Expense Distribution</h3>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>

        <div className="ebar-graph">
          <h3>Monthly Expenses</h3>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Expense;
