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
import "./Income.css";

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
      <div key={source} className={`income-box ${boxColor}`}>
        <span>{source}</span>
        <span>${totalForSource.toFixed(2)}</span>
      </div>
    );
  };

  return (
    <div className="income-container">
      <div className="income-list-container">
        <h2>Income</h2>
        {/* Month selection and income source toggle */}
        <div className="month-selection-container">
          <select value={selectedMonth} onChange={handleMonthSelection}>
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
          />
          <button
            className="income-bt"
            onClick={handleAddIncome}
            disabled={!formData.amount || !formData.income_source}
          >
            Add Income
          </button>
        </div>

        <h3>Total Income: ${totalIncome.toFixed(2)}</h3>

        {/* List of income entries for the selected month */}
        <div className="income-list-container">
          <ul>
            {filteredIncomeItems.map(({ id, amount, income_source, month }) => (
              <li key={id}>
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

      <div className="ichart-container">
        <div className="top-right">
          <div className="income-source">
            {incomeSources.map(renderIncomeSourceBox)}
          </div>

          <div className="income-chart">
            <h3>Monthly Income Distribution</h3>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>

        <div className="ibar-graph">
          <h3>Monthly Income</h3>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Income;
