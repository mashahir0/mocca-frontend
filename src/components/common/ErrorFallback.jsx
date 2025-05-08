import React from "react";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div style={{ padding: "2rem", textAlign: "center", color: "#fff", backgroundColor: "#333" }}>
      <h2>Something went wrong.</h2>
      <p>{error?.message || "Unknown error"}</p>
      <button
        onClick={resetErrorBoundary}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#5c6ac4",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorFallback;
