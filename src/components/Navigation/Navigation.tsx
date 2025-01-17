import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaChartLine,
  FaPiggyBank,
  FaMoneyBillAlt,
} from "react-icons/fa"; // Example icons for your menu
import { HiOutlineCreditCard } from "react-icons/hi";

function Navigation({ menus }: { menus: string[] }) {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location to highlight the active link

  // Define icons for each menu item with a fallback icon
  const menuIcons: Record<string, JSX.Element> = {
    Dashboard: <FaHome />,
    Income: <FaChartLine />,
    Expense: <FaMoneyBillAlt />, // Updated icon for Expense
    Savings: <FaPiggyBank />,
    // Add a fallback icon
    Default: <HiOutlineCreditCard />,
  };

  return (
    <div className="bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col justify-between p-4 fixed top-0 left-0 h-full w-56 md:w-40 sm:w-34 sm:p-3 shadow-lg">
      {/* Menu Items */}
      <div className="flex flex-col gap-8 md:gap-6 sm:gap-4">
        {menus.map((menu, index) => {
          const isActive =
            location.pathname === `/${menu.toLowerCase()}` ||
            (menu === "Dashboard" && location.pathname === "/");

          return (
            <div key={index}>
              <button
                className={`flex items-center gap-4 text-xl transition-all duration-300 ease-in-out hover:bg-white/20 rounded-lg p-3 ${
                  isActive ? "bg-white/20" : ""
                } md:text-lg sm:text-md`}
                onClick={() =>
                  navigate(
                    menu === "Dashboard" ? "/" : `/${menu.toLowerCase()}`
                  )
                }
              >
                <span className="text-2xl">
                  {menuIcons[menu] || menuIcons["Default"]}
                </span>{" "}
                {/* Icon */}
                <span>{menu}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Decorative Footer */}
      <div className="text-center text-white/70 text-sm md:text-xs sm:text-[10px] mt-auto">
        <hr className="border-white/30 mb-4" />
        <p className="font-bold">Finance Tracker App</p>
        <p className="font-light">Track your expenses and savings</p>
      </div>
    </div>
  );
}

export default Navigation;
