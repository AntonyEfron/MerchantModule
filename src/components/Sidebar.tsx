import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  onLogout: () => void;
  onToggle?: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, onToggle }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const sidebarStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #1a1d35 0%, #2d3561 100%)",
    color: "white",
    padding: "1.5rem 0",
    minHeight: "100vh",
    width: isOpen ? 260 : 80,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "fixed",
    top: 0,
    left: 0,
    boxShadow: "4px 0 20px rgba(0, 0, 0, 0.15)",
    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle: React.CSSProperties = {
    padding: "0 1.5rem",
    marginBottom: "2rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    paddingBottom: "1.5rem",
  };

  const toggleButtonStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.1)",
    border: "none",
    color: "white",
    fontSize: "1.2rem",
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    backdropFilter: "blur(10px)",
    margin: "0 auto",
    marginBottom: isOpen ? "1rem" : "0",
  };

  const logoStyle: React.CSSProperties = {
    fontSize: "1.4rem",
    fontWeight: "700",
    color: "#64b5f6",
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? "visible" : "hidden",
    transition: "all 0.3s ease",
    overflow: "hidden",
    whiteSpace: "nowrap",
    marginTop: "0.5rem",
    textAlign: "center",
  };

  const navStyle: React.CSSProperties = {
    padding: "0 1rem",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  };

  const linkStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "0.875rem 1.25rem",
    borderRadius: "12px",
    color: "white",
    textDecoration: "none",
    background: "transparent",
    marginBottom: "0.5rem",
    transition: "all 0.2s ease",
    position: "relative",
    overflow: "hidden",
    fontSize: "0.95rem",
    fontWeight: "500",
    justifyContent: isOpen ? "flex-start" : "center",
  };

  const activeLinkStyle: React.CSSProperties = {
    ...linkStyle,
    background: "rgba(100, 181, 246, 0.15)",
    color: "#64b5f6",
    boxShadow: "0 2px 8px rgba(100, 181, 246, 0.2)",
  };

const footerStyle: React.CSSProperties = {
  padding: "0 1rem",
  marginBottom: "3rem", // ⬅ Moves button up
  paddingTop: "1rem",
};

const logoutButtonStyle: React.CSSProperties = {
  ...linkStyle,
  background: "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)",
  marginTop: "0",
  marginBottom: "0",
  fontWeight: "600",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(229, 62, 62, 0.3)",
  justifyContent: "center",
  width: isOpen ? "100%" : "44px", // ⬅ match collapse size
  padding: isOpen ? "0.875rem 1.25rem" : "0.875rem 0", // ⬅ less padding when collapsed
};


  const iconStyle: React.CSSProperties = {
    marginRight: isOpen ? "12px" : "0",
    fontSize: "1.1rem",
    minWidth: "20px",
    transition: "margin 0.3s ease",
  };

  const textStyle: React.CSSProperties = {
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? "visible" : "hidden",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
    overflow: "hidden",
  };

  // Hover effects
  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!e.currentTarget.style.background.includes('linear-gradient')) {
      e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
      if (isOpen) {
        e.currentTarget.style.transform = "translateX(4px)";
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (!e.currentTarget.style.background.includes('linear-gradient')) {
      const isActive = location.pathname.includes(
        e.currentTarget.getAttribute('data-path') || ''
      );
      e.currentTarget.style.background = isActive 
        ? "rgba(100, 181, 246, 0.15)" 
        : "transparent";
      e.currentTarget.style.transform = "translateX(0)";
    }
  };

  const handleToggleHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
    e.currentTarget.style.transform = "scale(1.05)";
  };

  const handleToggleLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
    e.currentTarget.style.transform = "scale(1)";
  };

  const handleLogoutHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = "linear-gradient(135deg, #c53030 0%, #a02727 100%)";
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = "0 6px 20px rgba(229, 62, 62, 0.4)";
  };

  const handleLogoutLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)";
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 4px 12px rgba(229, 62, 62, 0.3)";
  };

  return (
    <div style={sidebarStyle}>
      <div style={headerStyle}>
        <button
          onClick={handleToggle}
          style={toggleButtonStyle}
          onMouseEnter={handleToggleHover}
          onMouseLeave={handleToggleLeave}
        >
          {isOpen ? "✕" : "☰"}
        </button>
        <div style={logoStyle}>
          Merchant Dashboard
        </div>
      </div>

      <nav style={navStyle}>
        <Link
          to="/merchant/add-product"
          style={
            location.pathname.includes("add-product")
              ? activeLinkStyle
              : linkStyle
          }
          data-path="add-product"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span style={iconStyle}>📦</span>
          <span style={textStyle}>Products</span>
        </Link>
        
        <Link
          to="/merchant/orders"
          style={
            location.pathname.includes("orders")
              ? activeLinkStyle
              : linkStyle
          }
          data-path="orders"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span style={iconStyle}>📋</span>
          <span style={textStyle}>Orders</span>
        </Link>
        
        <Link
          to="/merchant/accounts"
          style={
            location.pathname.includes("accounts")
              ? activeLinkStyle
              : linkStyle
          }
          data-path="accounts"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span style={iconStyle}>👥</span>
          <span style={textStyle}>Accounts</span>
        </Link>
      </nav>

      <div style={footerStyle}>
        <button
          onClick={onLogout}
          style={logoutButtonStyle}
          onMouseEnter={handleLogoutHover}
          onMouseLeave={handleLogoutLeave}
        >
          <span style={iconStyle}>🚪</span>
          <span style={textStyle}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;