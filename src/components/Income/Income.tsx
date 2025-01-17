import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  addIncome,
  removeIncome,
  updateIncome,
} from "../../slices/incomeSlice";
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
    date: "",
    editingId: "", // Track which income is being edited
  });
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showAllTransactions, setShowAllTransactions] = useState(false); // State to manage the visibility of all transactions

  const dispatch = useAppDispatch();
  const { incomeItems, totalIncome } = useAppSelector((state) => state.income);

  const incomeSources = [
    "Salary",
    "Freelance",
    "Investment",
    "Business",
    "Other",
  ];

  const incomeSourceIcons: Record<string, string> = {
    Salary: "💼",
    Freelance: "🖋️",
    Investment: "📈",
    Business: "🏢",
    Other: "💵",
  };

  const allMonths = [
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

  const months = useMemo(() => allMonths, []);

  const filteredIncomeByMonth = useMemo(
    () =>
      selectedMonth
        ? incomeItems.filter((income) => income.month === selectedMonth)
        : incomeItems,
    [incomeItems, selectedMonth]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddIncome = () => {
    if (
      !formData.amount ||
      !formData.income_source ||
      isNaN(Number(formData.amount)) ||
      !formData.date
    )
      return;

    const incomeDate = new Date(formData.date);
    const month = incomeDate.toLocaleString("default", { month: "long" });

    const newIncome = {
      id: Date.now().toString(),
      amount: parseFloat(formData.amount),
      income_source: formData.income_source,
      month,
      date: formData.date,
    };

    dispatch(addIncome(newIncome));
    setFormData({ amount: "", income_source: "", date: "", editingId: "" });
  };

  const handleRemoveIncome = (id: string) => dispatch(removeIncome(id));

  const handleEditIncome = (id: string) => {
    const incomeToEdit = incomeItems.find((income) => income.id === id);
    if (!incomeToEdit) return;

    setFormData({
      amount: incomeToEdit.amount.toString(),
      income_source: incomeToEdit.income_source,
      date: incomeToEdit.date,
      editingId: incomeToEdit.id, // Set the editing ID
    });
  };

  const handleUpdateIncome = () => {
    const updatedIncome = {
      id: formData.editingId,
      updatedIncome: {
        amount: parseFloat(formData.amount),
        income_source: formData.income_source,
        date: formData.date,
      },
    };
    dispatch(updateIncome(updatedIncome));
    setFormData({ amount: "", income_source: "", date: "", editingId: "" });
  };

  const pieChartData = {
    labels: incomeSources,
    datasets: [
      {
        label: `Income Distribution (${selectedMonth || "All Months"})`,
        data: incomeSources.map((income_source) =>
          filteredIncomeByMonth
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

  const barChartData = {
    labels: months,
    datasets: [
      {
        label: "Monthly Income",
        data: months.map((month) =>
          incomeItems
            .filter((income) => income.month === month)
            .reduce((sum, curr) => sum + curr.amount, 0)
        ),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "right" as const },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.label}: $${tooltipItem.raw.toFixed(2)}`;
          },
        },
      },
    },
  };

  const renderIncomeSourceBox = (source: string, showAmount: boolean) => {
    const isSelected = formData.income_source === source;

    const totalForSource = filteredIncomeByMonth
      .filter((income) => income.income_source === source)
      .reduce((sum, curr) => sum + curr.amount, 0);

    const boxColor =
      {
        Salary: "bg-green-200",
        Freelance: "bg-yellow-200",
        Business: "bg-purple-200",
        Investment: "bg-red-200",
        Other: "bg-teal-200",
      }[source] || "bg-teal-200";

    const selectedClass =
      isSelected && !showAmount
        ? "ring-4 ring-green-600 scale-105"
        : "hover:translate-y-[-3px]";

    return (
      <div
        key={source}
        onClick={() =>
          !showAmount &&
          setFormData((prev) => ({ ...prev, income_source: source }))
        }
        className={`flex flex-col pt-4 pb-4 justify-center items-center h-20 w-24 rounded-lg transition-all duration-300 ease-in-out cursor-pointer ${boxColor} ${selectedClass}`}
      >
        <span className="text-2xl">{incomeSourceIcons[source]}</span>
        <span className="text-gray-800 text-sm">{source}</span>
        {showAmount && (
          <span className="text-lg text-green-600">
            ${totalForSource.toFixed(2)}
          </span>
        )}
      </div>
    );
  };

  const handleToggleShowTransactions = () => {
    setShowAllTransactions((prevState) => !prevState);
  };

  return (
    <div className="flex pl-52 gap-4 justify-between pb-16 p-5 pt-2.5 box-border">
      <div className="p-5 bg-white/90 rounded-lg font-sans max-w-lg flex-1 min-w-[300px]">
        <h2 className="text-center text-2xl text-gray-800 mb-5">Income</h2>

        <div className="flex flex-wrap gap-4 p-4 justify-evenly rounded-lg bg-cyan-100">
          <h3 className="pl-[25%]">Make a selection</h3>
          {incomeSources.map((source) => renderIncomeSourceBox(source, false))}
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
          className="bg-green-600 text-white py-3 px-5 my-2 border-none cursor-pointer w-full opacity-90 rounded text-lg font-bold text-center transition-all duration-300 ease-in-out hover:bg-green-700 hover:opacity-100 hover:translate-y-[-2px]"
          onClick={formData.editingId ? handleUpdateIncome : handleAddIncome}
          disabled={
            !formData.amount || !formData.income_source || !formData.date
          }
        >
          {formData.editingId ? "Update Income" : "Add Income"}
        </button>

        <h3 className="text-xl text-gray-800 mb-5">
          Total Income: ${totalIncome.toFixed(2)}
        </h3>
      </div>

      <div className="flex flex-col flex-2 gap-5">
        <div className="top-right flex justify-evenly gap-8">
          <div className="flex flex-wrap gap-4 p-8 justify-evenly rounded-lg bg-cyan-100">
            {incomeSources.map((source) => renderIncomeSourceBox(source, true))}

            <p>Recent Transactions: </p>
            <ul className="list-none p-0 mb-2">
              {filteredIncomeByMonth
                .slice(
                  0,
                  showAllTransactions ? filteredIncomeByMonth.length : 4
                ) // Show all or limit to 4 items
                .reverse() // Reverse the array so the most recent items appear first
                .map(({ id, amount, income_source, month, date }) => (
                  <li
                    key={id}
                    className="bg-white/20 border border-gray-300 p-2 mb-2 rounded-lg text-sm text-gray-800 flex justify-evenly gap-2 items-center"
                  >
                    {month.slice(0, 3)}- {income_source} (${amount.toFixed(2)})
                    on {date}
                    <div className="space evenly flex gap-1">
                      <button
                        onClick={() => handleEditIncome(id)}
                        className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-700"
                        aria-label="Edit"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleRemoveIncome(id)}
                        className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
            </ul>

            {/* Toggle Button */}
            {filteredIncomeByMonth.length > 4 && (
              <button
                onClick={handleToggleShowTransactions}
                className=" ml-4 text-blue-500 hover:text-blue-700"
              >
                {showAllTransactions ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

          <div className="w-72 p-5 bg-cyan-100 rounded-lg">
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
                Income Distribution
              </h3>
            </div>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>

        <div className="bg-cyan-100 max-h-80 p-12 mx-8 pl-24 rounded-lg">
          <h3 className="text-center mb-5 text-gray-800">Monthly Income</h3>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Income;
