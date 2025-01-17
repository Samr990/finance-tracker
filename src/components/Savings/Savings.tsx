import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addSavings, setSavingsGoal } from "../../slices/savingsSlice";
import { Pie, Bar } from "react-chartjs-2";
import { ISavings } from "../../types";

const Savings: React.FC = () => {
  const [newGoal, setNewGoal] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("January");
  const [savingsAmount, setSavingsAmount] = useState<string>("");
  const [isSavingError, setIsSavingError] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const incomes = useAppSelector((state) => state.income.incomeItems);
  const expenses = useAppSelector((state) => state.expense.expenseItems);
  const savings = useAppSelector((state) => state.savings.savings);
  const savingsGoal = useAppSelector((state) => state.savings.savingsGoal);

  // Calculate total savings across all months
  const totalSavings = useMemo(() => {
    return savings.reduce((sum, curr) => sum + curr.amount, 0);
  }, [savings]);

  const totalSavingsByMonth = useMemo(() => {
    return (month: string) => {
      return savings
        .filter((saving) => saving.month === month)
        .reduce((sum, curr) => sum + curr.amount, 0);
    };
  }, [savings]);

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

  const handleAddSavings = () => {
    const savingsValue = parseFloat(savingsAmount);
    if (isNaN(savingsValue) || savingsValue <= 0) {
      setIsSavingError(true);
      return;
    }

    const newSavings: ISavings = {
      id: Date.now().toString(),
      amount: savingsValue,
      month: selectedMonth,
    };

    dispatch(addSavings(newSavings));
    setSavingsAmount("");
    setIsSavingError(false);
  };

  const handleSaveGoal = () => {
    if (newGoal) {
      dispatch(setSavingsGoal(newGoal));
      setNewGoal("");
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="ml-52 max-w-full p-5 font-sans bg-blue-50 rounded-lg shadow-md w-4/5 box-border">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-5 border-b-2 border-gray-200 pb-2">
        Savings & Goals
      </h2>

      <div className="flex justify-center mb-5">
        <input
          type="number"
          placeholder="Enter Savings Goal"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          className="p-3 text-base w-72 mr-3 border border-gray-300 rounded-md transition duration-300 focus:border-green-500 focus:outline-none"
        />
        <button
          onClick={handleSaveGoal}
          className="p-3 text-base bg-green-500 text-white rounded-md cursor-pointer transition duration-300 hover:bg-green-600"
        >
          Set Savings Goal
        </button>
      </div>

      {savingsGoal && (
        <div className="text-center mb-4 text-gray-700">
          <strong>Current Savings Goal: </strong>$
          {parseFloat(savingsGoal).toFixed(2)}
          <div className="font-normal">
            <strong>Total Amount Saved: </strong>$
            {savings.reduce((sum, saving) => sum + saving.amount, 0).toFixed(2)}
          </div>
          {savings.reduce((sum, saving) => sum + saving.amount, 0) >=
          parseFloat(savingsGoal) ? (
            <div className="text-green-600 font-semibold mt-2">
              🎉 Congratulations! You've reached your savings goal! 🎉
            </div>
          ) : (
            <div className="text-red-600 font-semibold mt-2">
              You need an additional $
              {(
                parseFloat(savingsGoal) -
                savings.reduce((sum, saving) => sum + saving.amount, 0)
              ).toFixed(2)}{" "}
              to reach your goal.
            </div>
          )}
        </div>
      )}

      <div className="text-center mb-5">
        <label className="text-lg font-semibold text-gray-800 mr-2">
          Select Month:
        </label>
        <select
          onChange={handleMonthChange}
          value={selectedMonth}
          className="p-2 text-base w-56 border border-gray-300 rounded-md bg-white transition duration-300 focus:border-green-500 focus:outline-none"
        >
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

      {selectedMonth && (
        <div>
          <h3 className="text-center text-xl mb-3">
            Enter Savings Amount for {selectedMonth}
          </h3>
          <div className="flex justify-center mb-5">
            <input
              type="number"
              value={savingsAmount}
              placeholder="Enter an amount"
              onChange={(e) => setSavingsAmount(e.target.value)}
              className="p-3 text-base w-64 mr-3 border border-gray-300 rounded-md transition duration-300 focus:border-pink-500 focus:outline-none"
            />
            <button
              onClick={handleAddSavings}
              className="p-3 text-base bg-pink-500 text-white rounded-md cursor-pointer transition duration-300 hover:bg-pink-600"
            >
              Add Savings
            </button>
          </div>
        </div>
      )}

      {isSavingError && (
        <div className="text-center text-red-600 font-semibold mb-3">
          Invalid savings amount.
        </div>
      )}

      <div className="flex justify-between my-12 p-6 gap-8">
        <div className="bg-white rounded-lg p-5 shadow-md w-2/5">
          <h3 className="text-center text-lg mb-4 text-gray-800">
            Income vs Savings for {selectedMonth}
          </h3>
          <Pie data={pieChartData} />
        </div>
        <div className="bg-white rounded-lg p-5 shadow-md w-3/5">
          <h3 className="text-center text-lg mb-4 text-gray-800">
            Monthly Saving Contribution
          </h3>
          <Bar data={barChartData} />
        </div>
      </div>
    </div>
  );
};

export default Savings;
