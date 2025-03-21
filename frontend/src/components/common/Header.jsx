import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "./Button";
import "../../styles/header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState("");

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const getButtonClass = (path) => {
    return `header-button ${activePath === path ? "active" : ""}`;
  };

  const handleProfileClick = () => {
    // Always navigate to user's own profile
    navigate("/profile");
  };

  return (
    <header className="header">
      <button
        onClick={() => navigate("/main")}
        className="ghost-button"
        aria-label="Go to main page"
      >
        ChronoFlow
      </button>
      <div className="header-buttons">
        <Button
          onClick={() => navigate("/leaderboard")}
          className={getButtonClass("/leaderboard")}
          aria-label="Go to leaderboard"
        >
          Leaderboard
        </Button>
        <Button
          onClick={() => navigate("/friends")}
          className={getButtonClass("/friends")}
          aria-label="Go to friends"
        >
          Friends
        </Button>
        <Button
          onClick={handleProfileClick}
          className={getButtonClass("/profile")}
          aria-label="Go to profile"
        >
          Profile
        </Button>
        <Button
          onClick={() => navigate("/")}
          className="header-button logout"
          aria-label="Logout"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
