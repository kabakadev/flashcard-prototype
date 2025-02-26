import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";

const NavBar = () => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="p-4 shadow-md bg-slate-500 flex justify-between items-center">
      <div>
        <NavLink to="/dashboard" className="mr-4 text-lg font-semibold">
          Dashboard
        </NavLink>
        <NavLink to="/mydecks" className="mr-4 text-lg font-semibold">
          My Decks
        </NavLink>
        <NavLink to="/study" className="text-lg font-semibold">
          Study
        </NavLink>
      </div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
};

export default NavBar;
