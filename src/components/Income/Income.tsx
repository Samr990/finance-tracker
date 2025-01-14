import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addIncome, removeIncome } from "../../slices/incomeSlice";
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
import "./Income.css";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Income: React.FC = () => {
  const [formData, setFormData] = useState({
    amount: "",
    income_source: "",
    month: "",
  });
  const [selectedMonth, setSelectedMonth] = useState<string>("January");

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

  // List of months
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

  const handleAddIncome = () => {
    if (!formData.amount || !formData.income_source || !formData.month) return;

    const newIncome = {
      id: Date.now().toString(),
      amount: parseFloat(formData.amount),
      income_source: formData.income_source,
      month: formData.month,
    };
    dispatch(addIncome(newIncome));
    setFormData({ amount: "", income_source: "", month: "" });
  };

  const handleRemoveIncome = (id: string) => {
    dispatch(removeIncome(id));
  };

  const handleMonthSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  // Filter income items by the selected month
  const filteredIncomeItems = useMemo(
    () => incomeItems.filter((income) => income.month === selectedMonth),
    [incomeItems, selectedMonth]
  );

  // Prepare data for the Pie Chart
  const incomeCategories = [
    ...new Set(filteredIncomeItems.map((income) => income.income_source)),
  ];
  const pieChartData = {
    labels: incomeCategories,
    datasets: [
      {
        label: `Income Distribution for ${selectedMonth}`,
        data: incomeCategories.map((income_source) =>
          filteredIncomeItems
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

  // Prepare data for the Bar Chart
  const monthlyIncomeData = months.reduce((acc, month) => {
    acc[month] = incomeItems
      .filter((income) => income.month === month)
      .reduce((sum, curr) => sum + curr.amount, 0);
    return acc;
  }, {} as Record<string, number>);

  const barChartData = {
    labels: months,
    datasets: [
      {
        label: "Monthly Income",
        data: months.map((month) => monthlyIncomeData[month]),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  return (
    <div className="income-container">
      <div className="income-list-container">
        <h2>Income</h2>
        <ul>
          {incomeItems.map(({ id, amount, income_source, month }) => (
            <li key={id}>
              {month} - {income_source}: ${amount.toFixed(2)}
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
        <select name="month" value={formData.month} onChange={handleChange}>
          <option value="">Select Month</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <button
          className="income-bt"
          onClick={handleAddIncome}
          disabled={
            !formData.amount || !formData.income_source || !formData.month
          }
        >
          Add Income
        </button>

        <h3>Total Income: ${totalIncome.toFixed(2)}</h3>
      </div>

      <div className="ichart-container">
        <div className="top-right">
          <div className="income-source  bg-blue-200">
            <div className="income-box  bg-green-200">Salary</div>
            <div className="income-box bg-yellow-200">Freelance</div>
            <div className="income-box bg-purple-200">Business</div>
            <div className="income-box bg-red-200 ">Investment</div>
            <div className="income-box bg-cyan-200 ">Social Media</div>
            <div className="income-box bg-teal-200 ">Other</div>
          </div>

          <div className="income-chart">
            <h3>Income Distribution</h3>
            <select value={selectedMonth} onChange={handleMonthSelection}>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <Pie data={pieChartData} />
          </div>
        </div>

        <div className="income-chart">
          <h3>Monthly Income</h3>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Income;
