import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addIncome, removeIncome } from "../../slices/incomeSlice";
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

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Income: React.FC = () => {
  const [formData, setFormData] = useState({ amount: "", income_source: "" });
  const [selectedMonth, setSelectedMonth] = useState<string>("January");

  const dispatch = useAppDispatch();
  const { incomeItems, totalIncome } = useAppSelector((state) => state.income);

  const incomeSources = [
    "Salary",
    "Freelance",
    "Investment",
    "Business",
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

  const handleAddIncome = () => {
    if (
      !formData.amount ||
      !formData.income_source ||
      isNaN(Number(formData.amount))
    )
      return;

    const newIncome = {
      id: Date.now().toString(),
      amount: parseFloat(formData.amount),
      income_source: formData.income_source,
      month: selectedMonth,
    };

    dispatch(addIncome(newIncome));
    setFormData({ amount: "", income_source: "" });
  };

  const handleRemoveIncome = (id: string) => dispatch(removeIncome(id));

  const handleMonthSelection = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedMonth(e.target.value);

  // Filter income items by selected month using useMemo
  const filteredIncomeItems = useMemo(
    () => incomeItems.filter((income) => income.month === selectedMonth),
    [incomeItems, selectedMonth]
  );

  // Prepare data for the Pie Chart
  const incomeCategories = useMemo(
    () => [
      ...new Set(filteredIncomeItems.map((income) => income.income_source)),
    ],
    [filteredIncomeItems]
  );

  const pieChartData = {
    labels: incomeCategories,
    datasets: [
      {
        label: `Income Distribution for ${selectedMonth}`,
        data: incomeCategories.map((income_source) =>
          filteredIncomeItems
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

  // Prepare data for the Bar Chart
  const monthlyIncomeData = useMemo(() => {
    return months.reduce((acc, month) => {
      acc[month] = incomeItems
        .filter((income) => income.month === month)
        .reduce((sum, curr) => sum + curr.amount, 0);
      return acc;
    }, {} as Record<string, number>);
  }, [incomeItems]);

  const barChartData = {
    labels: months,
    datasets: [
      {
        label: "Monthly Income",
        data: months.map((month) => monthlyIncomeData[month]),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const renderIncomeSourceBox = (source: string) => {
    const totalForSource = filteredIncomeItems
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

    return (
      <div
        key={source}
        className={`flex flex-col justify-center items-center h-24 w-28 rounded-lg  transition-all duration-300 ease-in-out hover:translate-y-[-3px] ${boxColor}`}
      >
        <span className="font-bold text-gray-800">{source}</span>
        <span className="text-lg text-green-600">
          ${totalForSource.toFixed(2)}
        </span>
      </div>
    );
  };

  return (
    <div className=" flex ml-52 gap-4 justify-between w-full p-5 pt-2.5 box-border">
      <div className=" p-5 bg-white/90 rounded-lg font-sans max-w-lg flex-1 min-w-[300px]">
        <h2 className="text-center text-2xl text-gray-800 mb-5">Income</h2>
        {/* Month selection and income source toggle */}
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
            name="income_source"
            value={formData.income_source}
            onChange={handleChange}
            className="w-full p-3 mb-2 rounded bg-gray-200/30"
          >
            <option value="">Select Income Source</option>
            {incomeSources.map((income_source) => (
              <option key={income_source} value={income_source}>
                {income_source}
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
            className=" bg-green-600 text-white py-3 px-5 my-2 border-none cursor-pointer w-full opacity-90 rounded text-lg font-bold text-center transition-all duration-300 ease-in-out hover:bg-green-700 hover:opacity-100 hover:translate-y-[-2px]"
            onClick={handleAddIncome}
            disabled={!formData.amount || !formData.income_source}
          >
            Add Income
          </button>
        </div>

        <h3 className="text-xl text-gray-800 mb-5">
          Total Income: ${totalIncome.toFixed(2)}
        </h3>

        {/* List of income entries for the selected month */}
        <div className="">
          <ul className="list-none p-0 mb-5">
            {filteredIncomeItems.map(({ id, amount, income_source, month }) => (
              <li
                key={id}
                className="bg-white border border-gray-300 p-3 mb-3 rounded-lg text-lg text-gray-800 flex justify-between items-center transition-all duration-300 ease-in-out hover:bg-gray-100 hover:translate-y-[-3px]"
              >
                {month} - {income_source}: ${amount.toFixed(2)}
                <button
                  onClick={() => handleRemoveIncome(id)}
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

      <div className=" flex flex-col flex-2 gap-5">
        <div className="top-right flex justify-evenly gap-8">
          <div className="flex flex-wrap gap-6 p-8 justify-evenly rounded-lg bg-cyan-100">
            {incomeSources.map(renderIncomeSourceBox)}
          </div>

          <div className="w-72 p-5 bg-cyan-100 rounded-lg">
            <h3 className="text-center mb-5 text-gray-800">
              Monthly Income Distribution
            </h3>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>

        <div className=" bg-cyan-100 max-h-80 p-12 mx-8 pl-24 rounded-lg">
          <h3 className="text-center mb-5 text-gray-800">Monthly Income</h3>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Income;
