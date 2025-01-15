import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addExpense, removeExpense } from "../../slices/expenseSlice";
import { IExpense } from "../../types";
import { calculateAvailableBalance } from "../../slices/balanceSlice";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

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
  const { expenseItems } = useAppSelector((state) => state.expense);
  const incomes = useAppSelector((state) => state.income.incomeItems);
  const savings = useAppSelector((state) => state.savings.savings);

  const expenseCategories = [
    "Food & Drinks",
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

    dispatch(
      calculateAvailableBalance({
        income: incomes,
        expenses: [...expenseItems, newExpense],
        savings,
      })
    );
  };

  const handleRemoveExpense = (id: string) => {
    const updatedExpenses = expenseItems.filter((expense) => expense.id !== id);
    dispatch(removeExpense(id));

    dispatch(
      calculateAvailableBalance({
        income: incomes,
        expenses: updatedExpenses,
        savings,
      })
    );
  };

  const handleMonthSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  const filteredExpenseItems = useMemo(
    () => expenseItems.filter((expense) => expense.month === selectedMonth),
    [expenseItems, selectedMonth]
  );

  const availableBalance = useAppSelector((state) => state.balance.amount);

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

  const renderExpenseCategoryBox = (category: string) => {
    const totalForCategory = filteredExpenseItems
      .filter((expense) => expense.category === category)
      .reduce((sum, curr) => sum + curr.amount, 0);

    const boxColor =
      {
        "Food & Drinks": "bg-pink-200",
        Rent: "bg-green-200",
        Utilities: "bg-yellow-200",
        Entertainment: "bg-purple-200",
        Other: "bg-gray-200",
      }[category] || "bg-gray-200";

    return (
      <div
        key={category}
        className={`flex flex-col justify-center items-center h-24 w-28 rounded-lg transition-all duration-300 ease-in-out hover:translate-y-[-3px] ${boxColor}`}
      >
        <span className="font-bold text-gray-800">{category}</span>
        <span className="text-lg text-green-600">
          ${totalForCategory.toFixed(2)}
        </span>
      </div>
    );
  };

  return (
    <div className="flex ml-52 gap-4 justify-between w-full p-5 pt-2.5 box-border">
      <div className="p-5 bg-white/90 rounded-lg font-sans max-w-lg flex-1 min-w-[300px]">
        <h2 className="text-center text-2xl text-gray-800 mb-5">Expenses</h2>
        <div className="month-selection-container">
          <select
            value={selectedMonth}
            onChange={handleMonthSelection}
            className="w-full p-3 mb-2 rounded bg-gray-200/30"
          >
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
            className="w-full p-3 mb-2 rounded bg-gray-200/30"
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
            className="w-full p-3 mb-2 rounded bg-gray-200/30"
          />
          <button
            className="bg-red-500 text-white py-3 px-5 my-2 border-none cursor-pointer w-full opacity-90 rounded text-lg font-bold text-center transition-all duration-300 ease-in-out hover:bg-red-600 hover:opacity-100 hover:translate-y-[-2px]"
            onClick={handleAddExpense}
            disabled={!formData.amount || !formData.category}
          >
            Add Expense
          </button>
        </div>

        <h3 className="text-xl text-gray-800 mb-5">
          Total Expenses: $
          {filteredExpenseItems
            .reduce((sum, curr) => sum + curr.amount, 0)
            .toFixed(2)}
        </h3>

        <h3 className="text-xl text-gray-800 mb-2">
          Available Balance: ${availableBalance.toFixed(2)}
        </h3>

        <div className="">
          <ul className="list-none p-0 mb-5">
            {filteredExpenseItems.map(({ id, amount, category, month }) => (
              <li
                key={id}
                className="bg-white border border-gray-300 p-3 mb-3 rounded-lg text-lg text-gray-800 flex justify-between items-center transition-all duration-300 ease-in-out hover:bg-gray-100 hover:translate-y-[-3px]"
              >
                {month} - {category}: ${amount.toFixed(2)}
                <button
                  onClick={() => handleRemoveExpense(id)}
                  className="ml-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                  aria-label="Remove"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col flex-2 gap-5">
        <div className="top-right flex justify-evenly gap-8">
          <div className="flex flex-wrap gap-6 p-8 justify-evenly rounded-lg bg-pink-50">
            {expenseCategories.map(renderExpenseCategoryBox)}
          </div>

          <div className="w-72 p-5 bg-pink-50 rounded-lg">
            <h3 className="text-center mb-5 text-gray-800">
              Monthly Expense Distribution
            </h3>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>

        <div className="bg-pink-50 max-h-80 p-12 mx-8 pl-24 rounded-lg">
          <h3 className="text-center mb-5 text-gray-800">Monthly Expenses</h3>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Expense;
