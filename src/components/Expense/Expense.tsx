import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  addExpense,
  removeExpense,
  updateExpense,
} from "../../slices/expenseSlice";
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
    date: "",
    editingId: "", // Track which expense is being edited
  });
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showAllTransactions, setShowAllTransactions] = useState(false); // State to manage the visibility of all transactions

  const dispatch = useAppDispatch();
  const { expenseItems } = useAppSelector((state) => state.expense);
  const incomes = useAppSelector((state) => state.income.incomeItems);
  const savings = useAppSelector((state) => state.savings.savings);

  const expenseCategories = [
    "Groceries",
    "Rent",
    "Utilities",
    "Entertainment",
    "Other",
  ];

  const expenseCategoryIcons: Record<string, string> = {
    Groceries: "🛒",
    Rent: "🏠",
    Utilities: "💡",
    Entertainment: "🎮",
    Other: "💳", // Credit card icon for "Other"
  };

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
    if (!formData.amount || !formData.category || !formData.date) return;

    const expenseDate = new Date(formData.date);
    const month = expenseDate.toLocaleString("default", { month: "long" });

    const newExpense: IExpense = {
      id: Date.now().toString(),
      category: formData.category,
      amount: parseFloat(formData.amount),
      month,
      date: formData.date,
    };

    dispatch(addExpense(newExpense));
    setFormData({ amount: "", category: "", date: "", editingId: "" });

    dispatch(
      calculateAvailableBalance({
        income: incomes,
        expenses: [...expenseItems, newExpense],
        savings,
      })
    );
  };

  const handleEditExpense = (id: string) => {
    const expenseToEdit = expenseItems.find((expense) => expense.id === id);
    if (!expenseToEdit) return;

    setFormData({
      amount: expenseToEdit.amount.toString(),
      category: expenseToEdit.category,
      date: expenseToEdit.date,
      editingId: expenseToEdit.id, // Set the editing ID
    });
  };

  const handleUpdateExpense = () => {
    const updatedExpense = {
      id: formData.editingId,
      updatedExpense: {
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
      },
    };
    dispatch(updateExpense(updatedExpense));
    setFormData({ amount: "", category: "", date: "", editingId: "" });
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

  const handleToggleShowTransactions = () => {
    setShowAllTransactions((prevState) => !prevState);
  };

  const filteredExpenseItems = useMemo(
    () =>
      selectedMonth
        ? expenseItems.filter((expense) => expense.month === selectedMonth)
        : expenseItems,
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

  const renderExpenseCategoryBox = (category: string, showAmount: boolean) => {
    const isSelected = formData.category === category;

    const totalForCategory = filteredExpenseItems
      .filter((expense) => expense.category === category)
      .reduce((sum, curr) => sum + curr.amount, 0);

    const boxColor =
      {
        Groceries: "bg-green-200",
        Rent: "bg-blue-200",
        Utilities: "bg-pink-200",
        Entertainment: "bg-purple-200",
        Other: "bg-red-200",
      }[category] || "bg-gray-200";

    const selectedClass =
      isSelected && !showAmount
        ? "ring-4 ring-red-600 scale-105"
        : "hover:translate-y-[-3px]";

    return (
      <div
        key={category}
        onClick={() =>
          !showAmount &&
          setFormData((prev) => ({ ...prev, category: category }))
        }
        className={`flex flex-col pt-4 pb-4 justify-center items-center h-20 w-24 rounded-lg transition-all duration-300 ease-in-out cursor-pointer ${boxColor} ${selectedClass}`}
      >
        <span className="text-gray-800 ">{expenseCategoryIcons[category]}</span>
        <span className="text-gray-800 text-sm">{category}</span>
        {showAmount && (
          <span className="text-lg text-red-600">
            ${totalForCategory.toFixed(2)}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex pl-52 gap-4 justify-between pb-16 p-5 pt-2.5 box-border">
      <div className="p-5 bg-white/90 rounded-lg font-sans max-w-lg flex-1 min-w-[300px]">
        <h2 className="text-center text-2xl text-gray-800 mb-5">Expenses</h2>

        <div className="flex flex-wrap gap-4 p-4 justify-evenly rounded-lg bg-pink-100">
          <h3 className="pl-[25%]">Make a selection</h3>
          {expenseCategories.map((category) =>
            renderExpenseCategoryBox(category, false)
          )}
        </div>

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full p-3 mb-2 rounded bg-gray-200/30"
        />

        <input
          type="date"
          name="date"
          placeholder="Date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-3 mb-2 rounded bg-gray-200/30"
        />

        <button
          className="bg-red-500 text-white py-3 px-5 my-2 border-none cursor-pointer w-full opacity-90 rounded text-lg font-bold text-center transition-all duration-300 ease-in-out hover:bg-red-600 hover:opacity-100 hover:translate-y-[-2px]"
          onClick={formData.editingId ? handleUpdateExpense : handleAddExpense}
          disabled={!formData.amount || !formData.category || !formData.date}
        >
          {formData.editingId ? "Update Expense" : "Add Expense"}
        </button>

        <h3 className="text-xl text-gray-800 mb-5">
          Total Expenses: $
          {filteredExpenseItems
            .reduce((sum, curr) => sum + curr.amount, 0)
            .toFixed(2)}
        </h3>

        <h3 className="text-xl text-gray-800 mb-2">
          Available Balance: ${availableBalance.toFixed(2)}
        </h3>
      </div>

      <div className="flex flex-col flex-2 gap-5">
        <div className="top-right flex justify-evenly gap-8">
          <div className="flex flex-wrap gap-6 p-8 justify-evenly rounded-lg bg-pink-100">
            {expenseCategories.map((category) =>
              renderExpenseCategoryBox(category, true)
            )}

            <p>Recent Transactions: </p>
            <ul className="list-none p-0 mb-2">
              {filteredExpenseItems
                .slice(0, showAllTransactions ? filteredExpenseItems.length : 4) // Show all or limit to 4 items
                .reverse() // Reverse the array so the most recent items appear first
                .map(({ id, amount, category, month, date }) => (
                  <li
                    key={id}
                    className="bg-white/20 border border-gray-300 p-2  mb-2 rounded-lg text-sm text-gray-800 flex justify-evenly gap-2 items-center "
                  >
                    {month.slice(0, 3)}- {category} (${amount.toFixed(2)}) on{" "}
                    {date}
                    <div className="space evenly flex gap-1">
                      <button
                        onClick={() => handleEditExpense(id)}
                        className=" bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-700"
                        aria-label="Edit"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleRemoveExpense(id)}
                        className=" bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
            </ul>

            {/* Toggle Button */}
            {filteredExpenseItems.length > 4 && (
              <button
                onClick={handleToggleShowTransactions}
                className=" ml-4 text-blue-500 hover:text-blue-700"
              >
                {showAllTransactions ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
          <div className="w-72 p-5 bg-pink-100 rounded-lg">
            <div className="flex">
              <select
                value={selectedMonth || ""}
                onChange={(e) => setSelectedMonth(e.target.value || null)}
                className="mb-8 p-2 rounded bg-white/50 border"
              >
                <option className="bg-white/20" value="">
                  All Months
                </option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <h3 className="text-center mb-8 text-gray-800">
                Expense Distribution
              </h3>
            </div>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>

        <div className="bg-pink-100 max-h-80 p-12 mx-8 pl-24 rounded-lg">
          <h3 className="text-center mb-5 text-gray-800">Monthly Expenses</h3>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Expense;
