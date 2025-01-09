import "./navigation.css";
import { useNavigate } from "react-router-dom";

function Navigation({ menus }: { menus: string[] }) {
  const navigate = useNavigate();
  return (
    <div className="nav">
      {menus.map((menu, index) => (
        <div key={index}>
          {menu === "Dashboard" ? (
            <button onClick={() => navigate(`/`)}> {menu}</button>
          ) : (
            <button onClick={() => navigate(`/${menu.toLowerCase()}`)}>
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
