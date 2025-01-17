import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks"; // Custom Redux hooks
import { Line, Pie } from "react-chartjs-2"; // Chart components
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

// Import reset actions
import { resetData as resetIncomeData } from "../../slices/incomeSlice";
import { resetData as resetExpenseData } from "../../slices/expenseSlice";
import { resetData as resetSavingsData } from "../../slices/savingsSlice";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const categoryIcons = {
  Income: "💵", // Money bag or dollar sign for Income
  Expense: "💸", // Money with wings for Expense
  Savings: "🏦", // Bank for Savings
};

function Dashboard() {
  const dispatch = useAppDispatch();

  // Selectors for Redux state
  const incomeItems = useAppSelector((state) => state.income.incomeItems);
  const expenseItems = useAppSelector((state) => state.expense.expenseItems);
  const savingsItems = useAppSelector((state) => state.savings.savings);

  // Aggregate monthly data for income, expense, and savings
  interface Item {
    month: string;
    amount: number;
  }

  const aggregateMonthlyData = (items: Item[]): number[] => {
    const monthlyTotals: number[] = Array(12).fill(0);
    items.forEach((item: Item) => {
      const monthIndex: number = new Date(`${item.month}-01`).getMonth();
      monthlyTotals[monthIndex] += item.amount;
    });
    return monthlyTotals;
  };

  const monthlyIncome = aggregateMonthlyData(incomeItems);
  const monthlyExpense = aggregateMonthlyData(expenseItems);
  const monthlySavings = aggregateMonthlyData(savingsItems);

  // Pie Chart Data for Current Month
  const currentMonth = new Date().getMonth();
  const pieChartData = {
    labels: ["Income", "Expense", "Savings"],
    datasets: [
      {
        label: "Current Month Data",
        data: [
          monthlyIncome[currentMonth] || 0,
          monthlyExpense[currentMonth] || 0,
          monthlySavings[currentMonth] || 0,
        ],
        backgroundColor: ["#36A2EB", "#FF6384", "#FF9F40"],
      },
    ],
  };

  // Line Chart Data for Monthly Comparison
  const lineChartData = {
    labels: [
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
    ],
    datasets: [
      {
        label: "Income",
        data: monthlyIncome,
        borderColor: "#36A2EB",
        fill: false,
      },
      {
        label: "Expense",
        data: monthlyExpense,
        borderColor: "#FF6384",
        fill: false,
      },
      {
        label: "Savings",
        data: monthlySavings,
        borderColor: "#FF9F40",
        fill: false,
      },
    ],
  };

  // Clear all data handler
  const clearData = () => {
    dispatch(resetIncomeData());
    dispatch(resetExpenseData());
    dispatch(resetSavingsData());
  };

  return (
    <div className="container mx-auto pl-52 p-4">
      <p className="mb-8">
        NOTE: the data shown is dummy data, to clear this data click here!!
        <button
          onClick={clearData}
          className="mb-4 ml-4 py-2 px-4 bg-red-500 text-white rounded-lg"
        >
          Clear All Data
        </button>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Income Section */}
        <div className="bg-blue-100 shadow-md rounded-lg p-4 flex items-center">
          <span className="text-3xl mr-4">{categoryIcons.Income}</span>{" "}
          <div>
            <p className="text-lg font-semibold">Income</p>
            <p className="text-2xl">
              $
              {monthlyIncome
                .reduce((sum, income) => sum + income, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>

        {/* Expense Section */}
        <div className="bg-red-100 shadow-md rounded-lg p-4 flex items-center">
          <span className="text-3xl mr-4">{categoryIcons.Expense}</span>{" "}
          <div>
            <p className="text-lg font-semibold">Expense</p>
            <p className="text-2xl">
              $
              {monthlyExpense
                .reduce((sum, expense) => sum + expense, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>

        {/* Savings Section */}
        <div className="bg-orange-100 shadow-md rounded-lg p-4 flex items-center">
          <span className="text-3xl mr-4">{categoryIcons.Savings}</span>{" "}
          <div>
            <p className="text-lg font-semibold">Savings</p>
            <p className="text-2xl">
              $
              {monthlySavings
                .reduce((sum, savings) => sum + savings, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Pie Chart Section */}
      <div className="mt-8">
        <h1 className="text-3xl font-bold">Current Month Overview</h1>
        <div className="flex justify-center">
          <div className="w-1/2 max-w-xs">
            <Pie data={pieChartData} options={{ responsive: true }} />
          </div>
        </div>
      </div>

      {/* Line Chart Section */}
      <div className="mt-8">
        <h1 className="text-3xl font-bold">Monthly Comparison</h1>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <Line data={lineChartData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
