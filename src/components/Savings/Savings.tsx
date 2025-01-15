import React, { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addSavings, setSavingsGoal } from "../../slices/savingsSlice";
import { calculateAvailableBalance } from "../../slices/balanceSlice";
import { Pie, Bar } from "react-chartjs-2";
import { ISavings } from "../../types";
import "./savings.css";

const Savings: React.FC = () => {
  const [newGoal, setNewGoal] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("January");
  const [savingsAmount, setSavingsAmount] = useState<string>(""); // Initialize as empty string
  const [isSavingError, setIsSavingError] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const incomes = useAppSelector((state) => state.income.incomeItems);
  const expenses = useAppSelector((state) => state.expense.expenseItems);
  const savings = useAppSelector((state) => state.savings.savings);
  const savingsGoal = useAppSelector((state) => state.savings.savingsGoal);
  const availableBalance = useAppSelector((state) => state.balance.amount);

  // Helper function to calculate total savings by month
  const totalSavingsByMonth = useMemo(() => {
    return (month: string) => {
      return savings
        .filter((saving) => saving.month === month)
        .reduce((sum, curr) => sum + curr.amount, 0);
    };
  }, [savings]);

  // Memoized available balance calculation
  const calculateAvailableBalanceFn = useMemo(() => {
    return () => {
      const totalIncome = incomes
        .filter((income) => income.month === selectedMonth)
        .reduce((sum, curr) => sum + curr.amount, 0);
      const totalExpenses = expenses
        .filter((expense) => expense.month === selectedMonth)
        .reduce((sum, curr) => sum + curr.amount, 0);
      return totalIncome - totalExpenses - totalSavingsByMonth(selectedMonth);
    };
  }, [incomes, expenses, selectedMonth, totalSavingsByMonth]);

  // Pie chart data
  const pieChartData = useMemo(() => {
    return {
      labels: ["Income", "Savings"],
      datasets: [
        {
          data: [
            incomes
              .filter((income) => income.month === selectedMonth)
              .reduce((sum, curr) => sum + curr.amount, 0),
            totalSavingsByMonth(selectedMonth),
          ],
          backgroundColor: ["#36A2EB", "#FF6384"],
          hoverBackgroundColor: ["#36A2EB", "#FF6384"],
        },
      ],
    };
  }, [incomes, selectedMonth, totalSavingsByMonth]);

  // Bar chart data
  const barChartData = useMemo(() => {
    return {
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
          label: "Total Savings",
          data: Array.from({ length: 12 }, (_, index) =>
            totalSavingsByMonth(
              new Date(2023, index).toLocaleString("default", { month: "long" })
            )
          ),
          backgroundColor: "#FF6384",
        },
      ],
    };
  }, [totalSavingsByMonth]);

  // Handle adding savings
  const handleAddSavings = () => {
    const savingsValue = parseFloat(savingsAmount);
    if (
      isNaN(savingsValue) ||
      savingsValue <= 0 ||
      savingsValue > availableBalance
    ) {
      setIsSavingError(true);
      return;
    }

    const newSavings: ISavings = {
      id: Date.now().toString(),
      amount: savingsValue,
      month: selectedMonth,
    };

    dispatch(addSavings(newSavings));
    setSavingsAmount(""); // Clear input
    setIsSavingError(false); // Reset error state
  };

  // Handle saving goal
  const handleSaveGoal = () => {
    if (newGoal) {
      dispatch(setSavingsGoal(newGoal));
      setNewGoal(""); // Clear input after saving
    }
  };

  // Handle month change
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
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
          onChange={(e) => setNewGoal(e.target.value)}
        />
        <button onClick={handleSaveGoal}>Set Savings Goal</button>
      </div>

      {/* Display current savings goal */}
      {savingsGoal && (
        <div className="current-savings-goal">
          <strong>Current Savings Goal: </strong>$
          {parseFloat(savingsGoal).toFixed(2)}
          <div className="available-balance">
            <strong>Available Balance: </strong>${availableBalance.toFixed(2)}
          </div>
        </div>
      )}

      {/* Month Selection */}
      <div className="month-selection">
        <label>Select Month:</label>
        <select onChange={handleMonthChange} value={selectedMonth}>
          <option value="">Select Month</option>
          {[
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
          ].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Savings Input */}
      {selectedMonth && (
        <div>
          <h3>Enter Savings Amount for {selectedMonth}</h3>
          <input
            className="w-100 h-12"
            type="number"
            value={savingsAmount}
            placeholder="Enter an amount"
            onChange={(e) => setSavingsAmount(e.target.value)} // Keep as string
          />
          <button className="bttn" onClick={handleAddSavings}>
            Add Savings
          </button>
        </div>
      )}

      {/* Display Error Message */}
      {isSavingError && (
        <div className="error-message">
          <span style={{ color: "red" }}>
            Invalid savings amount or exceeds available balance.
          </span>
        </div>
      )}

      {/* Charts */}
      <div className="side-by-side">
        <div className="chart-container">
          <h3>Income vs Savings for {selectedMonth}</h3>
          <Pie data={pieChartData} />
        </div>
        <div className="chart-container">
          <h3>Income and Savings by Month</h3>
          <Bar data={barChartData} />
        </div>
      </div>
    </div>
  );
};

export default Savings;
