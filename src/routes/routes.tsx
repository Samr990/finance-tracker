import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";

const Home = lazy(() => import("../pages/HomePage"));
const ExpensePage = lazy(() => import("../pages/ExpensePage"));
const IncomePage = lazy(() => import("../pages/IncomePage"));
const SavingsPage = lazy(() => import("../pages/SavingsPage"));

function RoutingNavigation() {
  return (
    <BrowserRouter>
      <Navigation menus={["Dashboard", "Income", "Expenses", "Savings"]} />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/expenses" element={<ExpensePage />} />
          <Route path="/savings" element={<SavingsPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default RoutingNavigation;
