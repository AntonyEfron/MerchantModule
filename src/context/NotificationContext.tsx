import React, { createContext, useContext, useState, useEffect } from "react";
import { emitter } from "../utils/socket";
import { acceptOrRejectOrder } from "../api/order";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [ordersQueue, setOrdersQueue] = useState([]);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
    const handler = (order) => {
      setOrdersQueue((prev) => [...prev, order]);
      setNewOrderCount((prev) => prev + 1);
    };

    emitter.on("newOrder", handler);

    return () => emitter.off("newOrder", handler);
  }, []);

  // Show the next order when currentOrder is null and queue has items
  useEffect(() => {
    if (!currentOrder && ordersQueue.length > 0) {
      setCurrentOrder(ordersQueue[0]);
      setOrdersQueue((prev) => prev.slice(1));
    }
  }, [ordersQueue, currentOrder]);

  const closePopup = () => {
    setCurrentOrder(null);
  };

  const acceptOrder = async() => {
    try {
      await acceptOrRejectOrder(currentOrder.id);
    } catch (error) {
      console.log(error);
    }
    console.log("✅ Accept order:", currentOrder);
    closePopup();
    // call API or other logic here
  };

  const rejectOrder = async() => {
    try {
      await acceptOrRejectOrder(currentOrder.id);
    } catch (error) {
      console.log(error);
    }
    console.log("❌ Reject order:", currentOrder);
    closePopup();
    // call API or other logic here
  };

  return (
    <NotificationContext.Provider value={{ newOrderCount }}>
      {children}

      {/* Popup overlay */}
      {currentOrder && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h3>📩 New Order!</h3>
            <p>Order ID: {currentOrder.id}</p>
            <p>Customer: {currentOrder.customerName}</p>
            <p>Total: ${currentOrder.total}</p>
            <button onClick={acceptOrder} style={styles.acceptBtn}>✅ Accept</button>
            <button onClick={rejectOrder} style={styles.rejectBtn}>❌ Reject</button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  },
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  },
  acceptBtn: {
    backgroundColor: '#4CAF50',
    color: 'white',
    marginRight: '10px',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px'
  },
  rejectBtn: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px'
  }
};
