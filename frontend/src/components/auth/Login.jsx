import React from "react";
import GoogleSignIn from "./GoogleSignIn";
import "../../styles/auth.css";

const Login = () => {
  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="form-title">Welcome to BulgarTabak</h2>
        <GoogleSignIn />
      </div>
    </div>
  );
};

export default Login;
