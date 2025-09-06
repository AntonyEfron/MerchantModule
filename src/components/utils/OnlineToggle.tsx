import React, { useState } from "react";
import { connectSocket, disconnectSocket } from "../../utils/socket";

interface OnlineToggleProps {
  merchantId: string;
}

const OnlineToggle: React.FC<OnlineToggleProps> = ({ merchantId }) => {
  const [online, setOnline] = useState(false);

  const handleToggle = () => {
    if (!online) {
      // 🔹 Going online directly
      connectSocket(merchantId);
      setOnline(true);
    } else {
      // 🔹 Going offline directly
      disconnectSocket();
      setOnline(false);
    }
  };

  const toggleStyles: React.CSSProperties = {
    position: "relative",
    width: "100px",
    height: "40px",
    backgroundColor: online ? "#4ade80" : "#e5e7eb",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    outline: "none",
    boxShadow: online
      ? "0 2px 8px rgba(74, 222, 128, 0.3)"
      : "0 2px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    padding: "3px",
    overflow: "hidden",
  };

  const sliderStyles: React.CSSProperties = {
    position: "absolute",
    width: "34px",
    height: "34px",
    backgroundColor: "#ffffff",
    borderRadius: "50%",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: online ? "translateX(63px)" : "translateX(0px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  };

  const iconStyles: React.CSSProperties = {
    width: "12px",
    height: "12px",
    transition: "all 0.3s ease",
  };

  const OnlineIcon = () => (
    <div
      style={{
        width: "6px",
        height: "6px",
        backgroundColor: "#22c55e",
        borderRadius: "50%",
        ...iconStyles,
      }}
    />
  );

  const OfflineIcon = () => (
    <div
      style={{
        width: "6px",
        height: "6px",
        backgroundColor: "#9ca3af",
        borderRadius: "50%",
        ...iconStyles,
      }}
    />
  );

  const labelStyles: React.CSSProperties = {
    position: "absolute",
    fontSize: "10px",
    fontWeight: "600",
    color: "#ffffff",
    transition: "all 0.3s ease",
    userSelect: "none",
    zIndex: 1,
    left: online ? "10px" : "42px",
    opacity: 0.9,
    letterSpacing: "0.3px",
  };

  return (
    <button
      onClick={handleToggle}
      style={toggleStyles}
      aria-label={online ? "Go offline" : "Go online"}
      role="switch"
      aria-checked={online}
    >
      <span style={labelStyles}>{online ? "ONLINE" : "OFFLINE"}</span>
      <div style={sliderStyles}>{online ? <OnlineIcon /> : <OfflineIcon />}</div>
    </button>
  );
};

export default OnlineToggle;
