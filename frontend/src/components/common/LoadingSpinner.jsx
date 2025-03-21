import React from "react";
import "../../styles/loading.css";

const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner">
      <div className="spinner-inner"></div>
    </div>
    <p>Loading...</p>
  </div>
);

export default LoadingSpinner;
