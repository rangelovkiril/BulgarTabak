import React from "react";
import GoogleSignIn from "./GoogleSignIn";
import "../../styles/auth.css";

const Login = () => {
  return (
    <div className="auth-container">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="auth-form">
        <h2 className="form-title">ChronoFlow</h2>
        <GoogleSignIn />
      </div>
    </div>
  );
};

export default Login;
