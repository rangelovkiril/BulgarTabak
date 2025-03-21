import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import "../../styles/header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <button onClick={() => navigate("/main")} className="ghost-button">
        ChronoFlow
      </button>
      <div className="header-buttons">
        <Button
          onClick={() => navigate("/leaderboard")}
          className="header-button"
        >
          Leaderboard
        </Button>
        <Button onClick={() => navigate("/friends")} className="header-button">
          Friends
        </Button>
        <Button onClick={() => navigate("/profile")} className="header-button">
          Profile
        </Button>
        <Button onClick={() => navigate("/")} className="header-button logout">
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
