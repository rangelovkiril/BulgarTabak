import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../../firebase/firebase";

const GoogleSignIn = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      const result = await signInWithGoogle();

      // Store the user info in localStorage for consistency with existing code
      localStorage.setItem("user", JSON.stringify(result.user));

      // Navigate based on whether the user is new
      const redirectPath = result.user.isNewUser ? "/select-habits" : "/main";
      navigate(redirectPath);
    } catch (error) {
      console.error("Login error:", error);
      setError("Authentication failed. Please try again.");
    }
  };

  return (
    <>
      <button
        onClick={handleGoogleSignIn}
        className="google-button"
        style={{
          padding: "12px",
          backgroundColor: "white",
          color: "#757575",
          border: "1px solid #ddd",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          cursor: "pointer",
          fontWeight: "500",
          fontSize: "14px",
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          alt="Google logo"
          style={{ height: "18px", marginRight: "10px" }}
        />
        Sign in with Google
      </button>
      {error && <div className="auth-error">{error}</div>}
    </>
  );
};

export default GoogleSignIn;
