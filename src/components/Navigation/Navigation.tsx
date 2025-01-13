import "./navigation.css";
import { useNavigate } from "react-router-dom";

function Navigation({ menus }: { menus: string[] }) {
  const navigate = useNavigate();
  return (
    <div className="nav">
      {menus.map((menu, index) => (
        <div key={index}>
          {menu === "Dashboard" ? (
            <button className="nav-item" onClick={() => navigate(`/`)}>
              {" "}
              {menu}
            </button>
          ) : (
            <button
              className="nav-item"
              onClick={() => navigate(`/${menu.toLowerCase()}`)}
            >
              {" "}
              {menu}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Navigation;
