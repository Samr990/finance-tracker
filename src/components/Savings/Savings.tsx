import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addSavings, setSavingsGoal } from "../../slices/savingsSlice";
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
import "./savings.css"; // Import the CSS module

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
  const [newGoal, setNewGoal] = useState<string>("");

  const dispatch = useAppDispatch();
  const incomes = useAppSelector((state) => state.income);
  const { savings, savingsGoal } = useAppSelector((state) => state.savings);

  // Helper function to calculate total savings per category
  const getTotalSavingsForCategory = (category: string) => {
    return savings
      .filter((saving) => saving.category === category)
      .reduce((sum, curr) => sum + curr.amount, 0);
  };

  // Handle saving data changes
  const handleSavingsChange = (category: string, value: string) => {
    setSavingsData((prev) => ({ ...prev, [category]: value }));
  };

  // Handle adding savings
  const handleAddSavings = (category: string) => {
    const amount = parseFloat(savingsData[category]);
    const incomeAmount =
      incomes.find((income) => income.source === category)?.amount || 0;
    const currentSavings = getTotalSavingsForCategory(category);

    if (!amount || amount + currentSavings > incomeAmount) return;

    const newSavings: ISavings = {
      id: Date.now().toString(),
      category,
      amount,
    };
    dispatch(addSavings(newSavings));
    setSavingsData((prev) => ({ ...prev, [category]: "" }));
  };

  // Calculate savings percentage
  const getSavingsPercentage = () => {
    const goalAmount = parseFloat(savingsGoal);
    const totalSavings = savings.reduce((sum, curr) => sum + curr.amount, 0);
    return ((totalSavings / goalAmount) * 100).toFixed(2);
  };

  // Prepare data for the Pie Chart
  const savingsCategories = useMemo(
    () => [...new Set(savings.map((saving) => saving.category))],
    [savings]
  );

  const pieChartData = {
    labels: savingsCategories,
    datasets: [
      {
        label: "Savings Distribution",
        data: savingsCategories.map((category) =>
          getTotalSavingsForCategory(category)
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
          getTotalSavingsForCategory(income.source)
        ),
        backgroundColor: "#FF6384",
      },
    ],
  };

  // Handle savings goal change
  const handleGoalChange = (value: string) => {
    setNewGoal(value);
  };

  // Save savings goal to the Redux store
  const handleSaveGoal = () => {
    if (newGoal) {
      dispatch(setSavingsGoal(newGoal)); // Save goal to the store
      setNewGoal(""); // Clear the input field after saving
    }
  };

  return (
    <div className="savings-container">
      <h2>Savings & Goals</h2>

      {/* Savings Goal Input */}
      <div className="savings-goal">
        <input
          type="number"
          placeholder="Enter Savings Goal"
          value={newGoal}
          onChange={(e) => handleGoalChange(e.target.value)}
        />
        <button onClick={handleSaveGoal}>Set Savings Goal</button>
      </div>

      {/* Display the current savings goal amount */}
      {savingsGoal && (
        <div className="current-savings-goal">
          <strong>Current Savings Goal: </strong>$
          {parseFloat(savingsGoal).toFixed(2)}
        </div>
      )}

      {/* Goal Percentage */}
      {savingsGoal && (
        <div>
          <strong>Savings Goal Percentage: </strong> {getSavingsPercentage()}%
        </div>
      )}

      {/* Savings Inputs for each income */}
      <ul>
        {incomes.map(({ id, source, amount }) => (
          <li key={id}>
            <div className="savings-category">
              <span>{source}</span>
              <span>Savings ${amount.toFixed(2)}</span>
            </div>
            <input
              type="number"
              placeholder="Enter an amount"
              value={savingsData[source] || ""}
              onChange={(e) => handleSavingsChange(source, e.target.value)}
            />
            <button
              className="savingsBt"
              onClick={() => handleAddSavings(source)}
              disabled={
                !savingsData[source] ||
                parseFloat(savingsData[source]) +
                  getTotalSavingsForCategory(source) >
                  amount
              }
            >
              Add Savings
            </button>
          </li>
        ))}
      </ul>

      {/* Chart */}
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
