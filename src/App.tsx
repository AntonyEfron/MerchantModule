import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import Login from './components/Login/Login';
import Register from './components/Login/Register';
import Sidebar from './components/Sidebar';
import ProductPage from './components/ProductPage/ProductPage';
import Orders from './Pages/Order';
import Accounts from './Pages/Accounts';
import RingNotification from './components/Order/RingNotification';
import OrderManagement from './components/Order/OrderManagement';

// 👉 New pages
import AddNewProduct from './components/Products/AddNewProduct';
import AddBrandPage from './components/Brand/AddBrandPage';

// Layout
function AppLayout({ children }: { children: React.ReactNode }) {
  const { token, logout } = useAuth();
  const location = useLocation();
  const publicPaths = ['/merchant/login', '/merchant/register'];
  const isPublicPage = publicPaths.includes(location.pathname);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    padding: "2.5rem 2rem",
    background: "#f4f4f9",
    minHeight: "100vh",
    marginLeft: token ? (sidebarOpen ? 260 : 80) : 0,
    transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    width: `calc(100% - ${token ? (sidebarOpen ? 260 : 80) : 0}px)`,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {token && (
        <Sidebar
          onLogout={logout}
          onToggle={(isOpen) => setSidebarOpen(isOpen)}
        />
      )}
      <div style={mainContentStyle}>
        {children}
        <RingNotification />
      </div>
    </div>
  );
}

function AppRoot() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppLayout>
            <Routes>
              {/* Public */}
              <Route path="/merchant/login" element={<Login />} />
              <Route path="/merchant/register" element={<Register />} />

              {/* Product + Brand Pages */}
              <Route path="/merchant/products" element={<ProductPage />} />
              <Route path="/add-product" element={<AddNewProduct />} />
              <Route path="/add-brand" element={<AddBrandPage />} />

              {/* Others */}
              <Route path="/merchant/orders" element={<OrderManagement />} />
              <Route path="/merchant/accounts" element={<Accounts />} />

              {/* Default */}
              <Route path="/" element={<Navigate to="/merchant/products" />} />
            </Routes>
          </AppLayout>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default AppRoot;
