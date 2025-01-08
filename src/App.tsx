import React from "react";
import Income from "./components/Income";
import Expenses from "./components/Expense";

const App: React.FC = () => {
  return (
    <div>
      <h1>Finance Tracker</h1>
      <Income />
      <Expenses />
    </div>
  );
};

export default App;
