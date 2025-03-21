import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Keep local mode for development
  const isLocalMode = localStorage.getItem("localMode") === "true";

  useEffect(() => {
    // If we're in local mode, skip Firebase auth check
    if (isLocalMode) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // Check Firebase auth state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [isLocalMode]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated && !isLocalMode) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
