import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleGoogleLogin } from "../../services/auth";
import LoadingSpinner from "../common/LoadingSpinner";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const credential = searchParams.get("credential");

        if (credential) {
          const redirectPath = await handleGoogleLogin({ credential });
          navigate(redirectPath);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error during callback:", error);
        navigate("/");
      }
    };

    handleCallback();
  }, [navigate, location]);

  return <LoadingSpinner />;
};

export default GoogleCallback;
