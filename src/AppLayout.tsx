import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import NotificationBell from "./components/Order/styles/NotificationBell";
// import RingNotification from "./components/Order/RingNotification";

const AppLayout: React.FC = () => {
  const { token, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const sidebarWidth = sidebarOpen ? (isMobile ? 240 : 280) : 70;

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    padding: isMobile ? "1rem" : "2rem",
    background: "#f4f4f9",
    minHeight: "100vh",
    marginLeft: token ? (isMobile ? 0 : sidebarWidth) : 0,
    width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
    transition: "all 0.3s ease",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
        <Sidebar
        isOpen={sidebarOpen}
        onToggle={(isOpen) => setSidebarOpen(isOpen)}
        onLogout={logout}
        />
      <div style={mainContentStyle}>
        <Outlet />
        <NotificationBell />
      </div>
    </div>
  );
};

export default AppLayout;
