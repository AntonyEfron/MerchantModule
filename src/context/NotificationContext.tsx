import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from 'react';
import { fetchMerchantOrders } from '../api/order';

// ---- Types ----

export interface Order {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'packaging' | 'packed' | 'in-transit' | 'completed' | 'returned';
  acceptedAt?: Date;
  packedAt?: Date;
  transitAt?: Date;
  completedAt?: Date;
  returnedAt?: Date;
}

// ---- Context Interface ----

interface NotificationContextType {
  pendingOrders: Order[];
  acceptedOrders: Order[];
  packedOrders: Order[];
  transitOrders: Order[];
  completedOrders: Order[];
  returnedOrders: Order[];
  playRing: boolean;
  stopRing: () => void;
  addIncomingOrder: (order: Order) => void;
  acceptOrder: (orderId: string) => void;
  rejectOrder: (orderId: string) => void;
  markOrderPacked: (orderId: string) => void;
  markOrderInTransit: (orderId: string) => void;
  completeOrder: (orderId: string) => void;
  returnOrder: (orderId: string, fromPhase: 'transit' | 'completed') => void;
}

// ---- Context ----

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// ---- Provider Component ----

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [acceptedOrders, setAcceptedOrders] = useState<Order[]>([]);
  const [packedOrders, setPackedOrders] = useState<Order[]>([]);
  const [transitOrders, setTransitOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [returnedOrders, setReturnedOrders] = useState<Order[]>([]);
  const [playRing, setPlayRing] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio setup
  useEffect(() => {
    audioRef.current = new Audio('/notification-sound.mp3');
    audioRef.current.loop = true;
    audioRef.current.preload = 'auto';
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // Fetch initial orders on mount
  // useEffect(() => {
  //   const loadOrders = async () => {
  //     try {
  //       const apiOrders = await fetchMerchantOrders();
  //       // Distribute to state arrays based on status
  //       setPendingOrders(apiOrders.filter(o => o.status === 'pending'));
  //       setAcceptedOrders(apiOrders.filter(o => o.status === 'packaging' || o.status === 'accepted'));
  //       setPackedOrders(apiOrders.filter(o => o.status === 'packed'));
  //       setTransitOrders(apiOrders.filter(o => o.status === 'in-transit'));
  //       setCompletedOrders(apiOrders.filter(o => o.status === 'completed'));
  //       setReturnedOrders(apiOrders.filter(o => o.status === 'returned'));
  //     } catch (error) {
  //       console.error('Failed to fetch orders:', error);
  //     }
  //   };
  //   loadOrders();
  // }, []);

  // Notification audio
  const playNotification = useCallback(() => {
    setPlayRing(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        if (err.name !== 'AbortError') console.error(err);
      });
    }
  }, []);

  const stopRing = useCallback(() => {
    setPlayRing(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  // ----- Order Actions -----

  const addIncomingOrder = useCallback((order: Order) => {
    setPendingOrders(prev => [...prev, { ...order, status: 'pending' }]);
    playNotification();
  }, [playNotification]);

  const acceptOrder = useCallback((orderId: string) => {
    setPendingOrders(prevPending => {
      const order = prevPending.find(o => o.id === orderId);
      if (!order) return prevPending;
      setAcceptedOrders(prev => [...prev, { ...order, status: 'packaging', acceptedAt: new Date() }]);
      return prevPending.filter(o => o.id !== orderId);
    });
  }, []);

  const rejectOrder = useCallback((orderId: string) => {
    setPendingOrders(prev => prev.filter(o => o.id !== orderId));
  }, []);

  const markOrderPacked = useCallback((orderId: string) => {
    setAcceptedOrders(prevAccepted => {
      const order = prevAccepted.find(o => o.id === orderId);
      if (!order) return prevAccepted;
      setPackedOrders(prev => [...prev, { ...order, status: 'packed', packedAt: new Date() }]);
      return prevAccepted.filter(o => o.id !== orderId);
    });
  }, []);

  const markOrderInTransit = useCallback((orderId: string) => {
    setPackedOrders(prevPacked => {
      const order = prevPacked.find(o => o.id === orderId);
      if (!order) return prevPacked;
      setTransitOrders(prev => [...prev, { ...order, status: 'in-transit', transitAt: new Date() }]);
      return prevPacked.filter(o => o.id !== orderId);
    });
  }, []);

  const completeOrder = useCallback((orderId: string) => {
    setTransitOrders(prevTransit => {
      const order = prevTransit.find(o => o.id === orderId);
      if (!order) return prevTransit;
      setCompletedOrders(prev => [...prev, { ...order, status: 'completed', completedAt: new Date() }]);
      return prevTransit.filter(o => o.id !== orderId);
    });
  }, []);

  const returnOrder = useCallback((orderId: string, fromPhase: 'transit'|'completed') => {
    let order: Order | undefined = undefined;
    if (fromPhase === 'transit') {
      setTransitOrders(prev => {
        order = prev.find(o => o.id === orderId);
        return prev.filter(o => o.id !== orderId);
      });
    } else if (fromPhase === 'completed') {
      setCompletedOrders(prev => {
        order = prev.find(o => o.id === orderId);
        return prev.filter(o => o.id !== orderId);
      });
    }
    if (order) {
      setReturnedOrders(prev => [...prev, { ...order!, status: 'returned', returnedAt: new Date() }]);
    }
  }, []);

  // ---- Provider value ----
  const contextValue: NotificationContextType = {
    pendingOrders,
    acceptedOrders,
    packedOrders,
    transitOrders,
    completedOrders,
    returnedOrders,
    playRing,
    stopRing,
    addIncomingOrder,
    acceptOrder,
    rejectOrder,
    markOrderPacked,
    markOrderInTransit,
    completeOrder,
    returnOrder,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// ---- Context Consumer Hook ----

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
