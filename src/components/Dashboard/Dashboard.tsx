import React from "react";
import { useAppSelector } from "../../hooks/hooks"; // Assuming you're using Redux and a custom hook for dispatch and selector
import { selectTotalSavings } from "../../slices/savingsSlice"; // Import the selector for total savings
import { Pie } from "react-chartjs-2"; // Import Pie chart component
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js"; // ChartJS registration
import "./Dashboard.css";

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  // Access data from the Redux store
  const income = useAppSelector((state) => state.income.totalIncome);
  const expense = useAppSelector((state) => state.expense.totalExpense);
  const savings = useAppSelector(selectTotalSavings); // Use the selector for total savings

  // Pie Chart Data for the current month
  const pieChartData = {
    labels: ["Income", "Expense", "Savings"],
    datasets: [
      {
        label: "Income, Expense, and Savings for the Current Month",
        data: [income, expense, savings], // Replace with monthly data for the current month
        backgroundColor: ["#36A2EB", "#FF6384", "#FF9F40"],
        borderWidth: 1,
      },
    ],
  };

  // Example: Pie Chart Data for another set (could be a comparison or another period)
  const pieChartData2 = {
    labels: ["Income", "Expense", "Savings"],
    datasets: [
      {
        label: "Income, Expense, and Savings Comparison",
        data: [4000, 2500, 1000], // Replace with data for another comparison
        backgroundColor: ["#36A2EB", "#FF6384", "#FF9F40"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="d-container">
      <div className="dashboard">
        <div className="summary">
          <p>Income</p>
          <p>${income.toFixed(2)}</p> {/* Display income dynamically */}
        </div>

        <div className="summary">
          <p>Expense</p>
          <p>${expense.toFixed(2)}</p> {/* Display expense dynamically */}
        </div>

        <div className="summary">
          <p>Savings</p>
          <p>${savings.toFixed(2)}</p> {/* Display savings dynamically */}
        </div>
      </div>

      <div className="ratio-summary">
        <h1>Ratio</h1>
        <p>Income vs Expense vs Savings for this month</p>
        <div className="pie-chart-container">
          {/* Pie Charts side by side */}
          <div className="pie-chart">
            <h3>Current Month</h3>
            <Pie data={pieChartData} options={{ responsive: true }} />
          </div>

          <div className="pie-chart">
            <h3>Comparison</h3>
            <Pie data={pieChartData2} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
