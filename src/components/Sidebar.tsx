import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import OnlineToggle from "./utils/OnlineToggle";
// import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  onLogout: () => void;
  onToggle?: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, onToggle }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  //get merchantiD from localStorage
  const merchantData = JSON.parse(localStorage.getItem("merchant"));
console.log(merchantData?.id);
const merchantId = merchantData?.id;
  

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const sidebarStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: isOpen ? (isMobile ? "100vw" : "280px") : "70px",
    background: "linear-gradient(135deg, #1e1e2e 0%, #2a2d47 50%, #1a1d35 100%)",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: isOpen 
      ? "8px 0 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)"
      : "4px 0 16px rgba(0, 0, 0, 0.15)",
    zIndex: 1000,
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  };

  const headerStyle: React.CSSProperties = {
    padding: isOpen ? "2rem 1.5rem 1.5rem" : "1.5rem 0.5rem 1rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.03)",
    position: "relative",
    transition: "all 0.3s ease",
    minHeight: isOpen ? "auto" : "80px",
    display: "flex",
    flexDirection: "column",
    alignItems: isOpen ? "flex-start" : "center",
    justifyContent: "center",
  };

  const toggleButtonStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.1)",
    border: "none",
    color: "white",
    fontSize: "1.3rem",
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    backdropFilter: "blur(10px)",
    marginBottom: isOpen ? "1.5rem" : "0",
    alignSelf: isOpen ? "flex-end" : "center",
    position: "relative",
    overflow: "hidden",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isOpen ? "1.75rem" : "0px",
    fontWeight: 700,
    margin: "0 0 0.25rem 0",
    background: "linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.02em",
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? "visible" : "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    transform: isOpen ? "translateY(0)" : "translateY(-10px)",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    fontWeight: 500,
    margin: 0,
    color: "rgba(255, 255, 255, 0.7)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? "visible" : "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: isOpen ? "translateY(0)" : "translateY(-5px)",
  };

  const navStyle: React.CSSProperties = {
    flex: 1,
    padding: "1.5rem 0",
    overflowY: "auto",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  const navListStyle: React.CSSProperties = {
    listStyle: "none",
    margin: 0,
    padding: isOpen ? "0 1.5rem" : "0 0.5rem",
    transition: "padding 0.3s ease",
  };

  const linkStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: isOpen ? "0.875rem 1rem" : "0.875rem 0.5rem",
    color: "rgba(255, 255, 255, 0.85)",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "0.9rem",
    borderRadius: "14px",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    marginBottom: "0.5rem",
    justifyContent: isOpen ? "flex-start" : "center",
    minHeight: "48px",
  };

  const activeLinkStyle: React.CSSProperties = {
    ...linkStyle,
    color: "#ffffff",
    background: "linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(78, 205, 196, 0.2))",
    boxShadow: "0 4px 12px rgba(255, 107, 107, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
    transform: "translateX(0)",
  };

  const iconStyle: React.CSSProperties = {
    marginRight: isOpen ? "0.75rem" : "0",
    fontSize: "1.2rem",
    minWidth: "20px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "scale(1)",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 500,
    letterSpacing: "0.01em",
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? "visible" : "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    transform: isOpen ? "translateX(0)" : "translateX(-10px)",
  };

  const footerStyle: React.CSSProperties = {
    padding: isOpen ? "1.5rem" : "1rem 0.5rem",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(0, 0, 0, 0.1)",
    marginTop: "auto",
    transition: "all 0.3s ease",
  };

  const logoutButtonStyle: React.CSSProperties = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: isOpen ? "center" : "center",
    padding: isOpen ? "0.875rem 1rem" : "0.875rem 0.5rem",
    background: "linear-gradient(135deg, #e74c3c, #c0392b)",
    color: "white",
    border: "none",
    borderRadius: "14px",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(231, 76, 60, 0.3)",
    minHeight: "48px",
  };

  // Enhanced hover effects
  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLElement;
    if (!target.style.background.includes('linear-gradient(135deg, rgba(255, 107, 107')) {
      target.style.background = "rgba(255, 255, 255, 0.1)";
      target.style.transform = isOpen ? "translateX(4px)" : "scale(1.05)";
      target.style.boxShadow = "0 4px 16px rgba(255, 255, 255, 0.1)";
      
      const icon = target.querySelector('.nav-icon') as HTMLElement;
      if (icon) {
        icon.style.transform = "scale(1.1)";
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLElement;
    if (!target.style.background.includes('linear-gradient(135deg, rgba(255, 107, 107')) {
      const isActive = location.pathname.includes(
        target.getAttribute('data-path') || ''
      );
      target.style.background = isActive 
        ? "linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(78, 205, 196, 0.2))" 
        : "transparent";
      target.style.transform = "translateX(0) scale(1)";
      target.style.boxShadow = isActive 
        ? "0 4px 12px rgba(255, 107, 107, 0.15)" 
        : "none";
      
      const icon = target.querySelector('.nav-icon') as HTMLElement;
      if (icon) {
        icon.style.transform = "scale(1)";
      }
    }
  };

  const handleToggleHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
    e.currentTarget.style.transform = "scale(1.05) rotate(90deg)";
    e.currentTarget.style.boxShadow = "0 4px 16px rgba(255, 255, 255, 0.15)";
  };

  const handleToggleLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
    e.currentTarget.style.transform = "scale(1) rotate(0deg)";
    e.currentTarget.style.boxShadow = "none";
  };

  const handleLogoutHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = "linear-gradient(135deg, #c0392b, #a93226)";
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = "0 6px 20px rgba(231, 76, 60, 0.4)";
    
    const icon = e.currentTarget.querySelector('.logout-icon') as HTMLElement;
    if (icon) {
      icon.style.transform = "rotate(-15deg) scale(1.1)";
    }
  };

  const handleLogoutLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = "linear-gradient(135deg, #e74c3c, #c0392b)";
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 4px 12px rgba(231, 76, 60, 0.3)";
    
    const icon = e.currentTarget.querySelector('.logout-icon') as HTMLElement;
    if (icon) {
      icon.style.transform = "rotate(0deg) scale(1)";
    }
  };

  const navItems = [
    { path: "products", icon: "📦", label: "Products" },
    { path: "orders", icon: "📋", label: "Orders" },
    { path: "accounts", icon: "👥", label: "Accounts" },
  ];

  return (
    <div style={sidebarStyle}>
      <div style={headerStyle}>
        <OnlineToggle merchantId={merchantId} />
        <button
          onClick={handleToggle}
          style={toggleButtonStyle}
          onMouseEnter={handleToggleHover}
          onMouseLeave={handleToggleLeave}
        >
          {isOpen ? "✕" : "☰"}
        </button>
        <div style={titleStyle}>
          Merchant Hub
        </div>
        <div style={subtitleStyle}>
          Dashboard
        </div>
      </div>

      <nav style={navStyle}>
        <ul style={navListStyle}>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={`/merchant/${item.path}`}
                style={
                  location.pathname.includes(item.path)
                    ? activeLinkStyle
                    : linkStyle
                }
                data-path={item.path}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span className="nav-icon" style={iconStyle}>{item.icon}</span>
                <span style={labelStyle}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div style={footerStyle}>
        <button
          onClick={onLogout}
          style={logoutButtonStyle}
          onMouseEnter={handleLogoutHover}
          onMouseLeave={handleLogoutLeave}
        >
          <span className="logout-icon" style={{ 
            ...iconStyle, 
            marginRight: isOpen ? "0.5rem" : "0",
            transition: "all 0.2s ease"
          }}>
            🚪
          </span>
          <span style={labelStyle}>Logout</span>
        </button>
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
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
          onClick={handleToggle}
        />
      )}
    </div>
  );
};

export default Sidebar;