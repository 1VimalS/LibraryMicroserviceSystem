import React from "react";
import { useNavigate } from "react-router-dom";
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <button className="nav-button" onClick={() => navigate("/home")}>
        Home
      </button>
      <button className="nav-button" onClick={() => navigate("/checkout")}>
        Check Out
      </button>
      <button className="nav-button" onClick={() => navigate("/checkin")}>
        Check In
      </button>
    </div>
  );
};

export default Navbar;
