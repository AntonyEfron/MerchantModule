import React from "react";

const Accounts: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    background: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    maxWidth: "100%",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Accounts Page</h1>
      <p>This is the accounts page content.</p>
    </div>
  );
};

export default Accounts;
