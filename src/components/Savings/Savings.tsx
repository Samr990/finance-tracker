import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addSavings } from "../../slices/savingsSlice";
import { ISavings } from "../../types";
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
import "./Savings.css";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Savings: React.FC = () => {
  const [savingsData, setSavingsData] = useState<{ [key: string]: string }>({});
  const [savingsGoals, setSavingsGoals] = useState<{ [key: string]: string }>(
    {}
  );

  const dispatch = useAppDispatch();
  const incomes = useAppSelector((state) => state.income);
  const savings = useAppSelector((state) => state.savings);

  const handleSavingsChange = (category: string, value: string) => {
    setSavingsData((prev) => ({ ...prev, [category]: value }));
  };

  const handleGoalChange = (category: string, value: string) => {
    setSavingsGoals((prev) => ({ ...prev, [category]: value }));
  };

  const handleAddSavings = (category: string) => {
    const amount = parseFloat(savingsData[category]);
    const incomeAmount =
      incomes.find((income) => income.source === category)?.amount || 0;
    const currentSavings = savings
      .filter((saving) => saving.category === category)
      .reduce((sum, curr) => sum + curr.amount, 0);

    if (!amount || amount + currentSavings > incomeAmount) return;

    const newSavings: ISavings = {
      id: Date.now().toString(),
      category,
      amount,
    };
    dispatch(addSavings(newSavings));
    setSavingsData((prev) => ({ ...prev, [category]: "" }));
  };

  const getSavingsPercentage = (category: string) => {
    const totalIncome =
      incomes.find((income) => income.source === category)?.amount || 0;
    const totalSavings = savings
      .filter((saving) => saving.category === category)
      .reduce((sum, curr) => sum + curr.amount, 0);
    return ((totalSavings / totalIncome) * 100).toFixed(2);
  };

  const getGoalPercentage = (category: string) => {
    const totalIncome =
      incomes.find((income) => income.source === category)?.amount || 0;
    const goal = parseFloat(savingsGoals[category]) || 0;
    return ((goal / totalIncome) * 100).toFixed(2);
  };

  // Prepare data for the Pie Chart
  const savingsCategories = [
    ...new Set(savings.map((saving) => saving.category)),
  ];
  const pieChartData = {
    labels: savingsCategories,
    datasets: [
      {
        label: "Savings Distribution",
        data: savingsCategories.map((category) =>
          savings
            .filter((saving) => saving.category === category)
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
  const barChartData = {
    labels: incomes.map((income) => income.source),
    datasets: [
      {
        label: "Income",
        data: incomes.map((income) => income.amount),
        backgroundColor: "#36A2EB",
      },
      {
        label: "Savings",
        data: incomes.map((income) =>
          savings
            .filter((saving) => saving.category === income.source)
            .reduce((sum, curr) => sum + curr.amount, 0)
        ),
        backgroundColor: "#FF6384",
      },
    ],
  };

  return (
    <div className="savings-container">
      <h2>Savings</h2>
      <ul>
        {incomes.map(({ id, source, amount }) => (
          <li key={id}>
            <div>
              {source}: Max Savings ${amount.toFixed(2)}
            </div>
            <input
              type="number"
              placeholder="Enter Savings"
              value={savingsData[source] || ""}
              onChange={(e) => handleSavingsChange(source, e.target.value)}
            />
            <button
              className="savings-bt"
              onClick={() => handleAddSavings(source)}
              disabled={
                !savingsData[source] ||
                parseFloat(savingsData[source]) +
                  savings
                    .filter((saving) => saving.category === source)
                    .reduce((sum, curr) => sum + curr.amount, 0) >
                  amount
              }
            >
              Add Savings
            </button>
            <div>
              <strong>Savings Percentage:</strong>{" "}
              {getSavingsPercentage(source)}%
            </div>
            <input
              type="number"
              placeholder="Enter Goal"
              value={savingsGoals[source] || ""}
              onChange={(e) => handleGoalChange(source, e.target.value)}
            />
            <div>
              <strong>Goal Percentage:</strong> {getGoalPercentage(source)}%
            </div>
          </li>
        ))}
      </ul>

      <div className="chart-container">
        <h3>Savings Distribution</h3>
        <Pie data={pieChartData} />
      </div>

      <div className="chart-container">
        <h3>Income vs Savings by Category</h3>
        <Bar data={barChartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default Savings;
