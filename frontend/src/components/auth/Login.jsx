import React from "react";
import GoogleSignIn from "./GoogleSignIn";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../services/auth";
import "../../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();

  const handleDevLogin = () => {
    // Create mock user data
    const mockUser = {
      id: "dev-user-123",
      email: "dev@example.com",
      name: "Developer User",
    };

    // Set local mode flag
    localStorage.setItem("localMode", "true");

    // Create a fake token
    const mockToken = "dev-token-123456";

    // Store the mock data
    setToken(mockToken);
    localStorage.setItem("user", JSON.stringify(mockUser));

    // Navigate to main page
    navigate("/main");
  };

  return (
    <div className="auth-container">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="auth-form">
        <h2 className="form-title">ChronoFlow</h2>
        <GoogleSignIn />

        <div className="divider">or</div>

        <button
          onClick={handleDevLogin}
          className="dev-login-button"
          style={{
            padding: "15px 24px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "20px",
            width: "100%",
            fontWeight: "bold",
            fontSize: "16px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          Local Demo Mode (No Backend)
        </button>

        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            marginTop: "15px",
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          This will use browser storage instead of a backend server
        </p>
      </div>
    </div>
  );
};

export default Login;
