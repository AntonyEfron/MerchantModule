import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import OnlineToggle from "./utils/OnlineToggle";

interface SidebarProps {
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen: parentOpen, onToggle, onLogout }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(parentOpen);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const isMobile = windowWidth <= 768;
  const merchantId = localStorage.getItem("merchant_id");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => setIsOpen(parentOpen), [parentOpen]);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle(newState);
  };

  const sidebarStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: isOpen ? (isMobile ? "100vw" : "280px") : "70px",
    background: "linear-gradient(135deg, #1e1e2e 0%, #2a2d47 50%, #1a1d35 100%)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease",
    zIndex: 1000,
    overflow: "hidden",
    boxShadow: isOpen ? "8px 0 32px rgba(0,0,0,0.2)" : "4px 0 16px rgba(0,0,0,0.15)",
    backdropFilter: "blur(10px)",
  };

  const headerStyle: React.CSSProperties = {
    padding: isOpen ? "2rem 1.5rem 1.5rem" : "1.5rem 0.5rem 1rem",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: isOpen ? "flex-start" : "center",
  };

  const toggleButtonStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.1)",
    border: "none",
    color: "white",
    fontSize: "1.3rem",
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    cursor: "pointer",
    marginBottom: isOpen ? "1.5rem" : "0",
    alignSelf: isOpen ? "flex-end" : "center",
    transition: "all 0.2s ease",
  };

  const navStyle: React.CSSProperties = {
    flex: 1,
    padding: "1rem 0",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  };

  const navLinkStyle = (active: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    padding: isOpen ? "0.875rem 1rem" : "0.875rem 0.5rem",
    color: active ? "#fff" : "rgba(255,255,255,0.85)",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: isMobile ? "0.85rem" : "0.9rem",
    borderRadius: "14px",
    marginBottom: "0.5rem",
    justifyContent: isOpen ? "flex-start" : "center",
    background: active
      ? "linear-gradient(135deg, rgba(255,107,107,0.2), rgba(78,205,196,0.2))"
      : "transparent",
  });

  const navItems = [
    { path: "products", label: "Products", icon: "📦" },
    { path: "orders", label: "Orders", icon: "📋" },
    { path: "accounts", label: "Accounts", icon: "👥" },
  ];

  const footerStyle: React.CSSProperties = {
    padding: isOpen ? "1.5rem" : "1rem 0.5rem",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    marginTop: "auto",
  };

  return (
    <>
      <div style={sidebarStyle}>
        <div style={headerStyle}>
          <OnlineToggle merchantId={merchantId} />
          <button onClick={toggleSidebar} style={toggleButtonStyle}>
            {isOpen ? "✕" : "☰"}
          </button>
          {isOpen && <h2>Merchant Hub</h2>}
        </div>

        <nav style={navStyle}>
          {navItems.map((item) => {
            const active = location.pathname.includes(item.path);
            return (
              <Link key={item.path} to={`/merchant/${item.path}`} style={navLinkStyle(active)}>
                <span style={{ marginRight: isOpen ? "0.75rem" : "0" }}>{item.icon}</span>
                {isOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div style={footerStyle}>
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              padding: "0.875rem",
              borderRadius: "14px",
              background: "#e74c3c",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            {isOpen && "Logout"}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
