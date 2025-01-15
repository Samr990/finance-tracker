import React from "react";
import { useAppSelector } from "../../hooks/hooks"; // Assuming you're using Redux and a custom hook for dispatch and selector
import { selectTotalSavings } from "../../slices/savingsSlice"; // Import the selector for total savings
import { Pie } from "react-chartjs-2"; // Import Pie chart component
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js"; // ChartJS registration

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
    <div className="container mx-auto p-4 ml-52">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-lg p-4">
          <p className="text-lg font-semibold">Income</p>
          <p className="text-2xl">${income.toFixed(2)}</p>{" "}
          {/* Display income dynamically */}
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <p className="text-lg font-semibold">Expense</p>
          <p className="text-2xl">${expense.toFixed(2)}</p>{" "}
          {/* Display expense dynamically */}
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <p className="text-lg font-semibold">Savings</p>
          <p className="text-2xl">${savings.toFixed(2)}</p>{" "}
          {/* Display savings dynamically */}
        </div>
      </div>

      <div className="mt-8">
        <h1 className="text-3xl font-bold">Ratio</h1>
        <p className="text-lg">Income vs Expense vs Savings for this month</p>
        <div className="flex flex-col md:flex-row justify-around mt-4">
          {/* Pie Charts side by side */}
          <div className="w-full md:w-1/2 p-4">
            <h3 className="text-xl font-semibold">Current Month</h3>
            <Pie data={pieChartData} options={{ responsive: true }} />
          </div>

          <div className="w-full md:w-1/2 p-4">
            <h3 className="text-xl font-semibold">Comparison</h3>
            <Pie data={pieChartData2} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
