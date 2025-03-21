import React from "react";

class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    errorMessage: "",
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorMessage: error.message });
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Oops! Something went wrong.</h2>
          <p>{this.state.errorMessage}</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
