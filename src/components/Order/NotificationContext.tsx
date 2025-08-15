// context/NotificationContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

interface Order {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'packaging' | 'ready' | 'completed';
}

interface NotificationContextType {
  pendingOrders: Order[];
  acceptedOrders: Order[];
  addIncomingOrder: (order: Order) => void;
  acceptOrder: (orderId: string) => void;
  completePackaging: (orderId: string) => void;
  playRing: boolean;
  stopRing: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [acceptedOrders, setAcceptedOrders] = useState<Order[]>([]);
  const [playRing, setPlayRing] = useState(false);

  const addIncomingOrder = useCallback((order: Order) => {
    setPendingOrders(prev => [...prev, { ...order, status: 'pending' }]);
    setPlayRing(true);
  }, []);

  const acceptOrder = useCallback((orderId: string) => {
    setPendingOrders(prev => prev.filter(order => order.id !== orderId));
    
    const acceptedOrder = pendingOrders.find(order => order.id === orderId);
    if (acceptedOrder) {
      const orderWithTimer = {
        ...acceptedOrder,
        status: 'packaging' as const,
        acceptedAt: new Date()
      };
      
      setAcceptedOrders(prev => [...prev, orderWithTimer]);
      
      // Start 10-minute timer
      setTimeout(() => {
        setAcceptedOrders(prev => 
          prev.map(order => 
            order.id === orderId 
              ? { ...order, status: 'ready' as const }
              : order
          )
        );
      }, 10 * 60 * 1000); // 10 minutes
    }
    
    setPlayRing(false);
  }, [pendingOrders]);

  const completePackaging = useCallback((orderId: string) => {
    setAcceptedOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'completed' as const }
          : order
      )
    );
  }, []);

  const stopRing = useCallback(() => {
    setPlayRing(false);
  }, []);

  return (
    <NotificationContext.Provider value={{
      pendingOrders,
      acceptedOrders,
      addIncomingOrder,
      acceptOrder,
      completePackaging,
      playRing,
      stopRing
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
