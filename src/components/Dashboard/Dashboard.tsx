// import React from "react";
import "./Dashboard.css";
function Dashboard() {
  return (
    <div className="d-container">
      <div className="dashboard">
        <div className="summary">
          <p>Income</p>
          <p>$4000</p>
        </div>

        <div className="summary">
          <p>Expense</p>
          <p>$2500</p>
        </div>

        <div className="summary">
          <p>Savings</p>
          <p>$1000</p>
        </div>
      </div>
      <div className="ratio-summary">
        <h1>Ratio</h1>
      </div>
    </div>
  );
}

export default Dashboard;
