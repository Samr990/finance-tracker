import RoutingNavigation from "./routes/routes";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components globally
ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function App() {
  return (
    <div>
      <RoutingNavigation />
    </div>
  );
}

export default App;
