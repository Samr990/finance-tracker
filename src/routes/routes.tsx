import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/HomePage";
import ExpensePage from "../pages/ExpensePage";
import IncomePage from "../pages/IncomePage";
import SavingsPage from "../pages/SavingsPage";
import Navigation from "../components/Navigation/Navigation";

function RoutingNavigation() {
  return (
    <BrowserRouter>
      <Navigation menus={["Dashboard", "Income", "Expenses", "Savings"]} />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/dashboard" element={<Home />} /> */}
        <Route path="/expenses" element={<ExpensePage />} />
        <Route path="/income" element={<IncomePage />} />
        <Route path="/savings" element={<SavingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RoutingNavigation;
