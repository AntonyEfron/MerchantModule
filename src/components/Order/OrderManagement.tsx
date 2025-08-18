import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import './styles/OrderManagement.css';

type OrderPhase = 'pending' | 'in-progress' | 'in-transit' | 'returned' | 'completed';

const phaseMap: Record<OrderPhase, string> = {
  pending: 'Pending Orders',
  'in-progress': 'In Progress',
  'in-transit': 'In Transit',
  returned: 'Returned Orders',
  completed: 'Completed',
};

const phaseIconMap: Record<OrderPhase, string> = {
  pending: '⏳',
  'in-progress': '👨‍🍳',
  'in-transit': '🚚',
  returned: '↩️',
  completed: '✅',
};

const OrderManagement: React.FC = () => {
  const {
    pendingOrders,
    acceptedOrders,
    packedOrders,
    transitOrders,
    completedOrders,
    returnedOrders,
    acceptOrder,
    rejectOrder,
    markOrderPacked,
    markOrderInTransit,
    completeOrder,
    returnOrder,
    addIncomingOrder,
  } = useNotifications();

  const [activePhase, setActivePhase] = useState<OrderPhase>('pending');
  const [timers, setTimers] = useState<Record<string, number>>({});
  const [adherenceTimers, setAdherenceTimers] = useState<Record<string, number>>({});
  const notificationAudioRef = useRef<HTMLAudioElement>(null);

  // Packaging and adherence timers for accepted (“packaging”) and packed orders
  useEffect(() => {
    const intervals: Record<string, NodeJS.Timeout> = {};
    const adherenceIntervals: Record<string, NodeJS.Timeout> = {};

    acceptedOrders.concat(packedOrders).forEach(order => {
      // Packaging timer (10 min)
      if (order.status === 'packaging' && order.acceptedAt) {
        const startTime = new Date(order.acceptedAt).getTime();
        const endTime = startTime + 10 * 60 * 1000;
        intervals[order.id] = setInterval(() => {
          const now = Date.now();
          const remaining = Math.max(0, endTime - now);
          setTimers(prev => ({ ...prev, [order.id]: remaining }));
          if (remaining === 0) clearInterval(intervals[order.id]);
        }, 1000);
      }
      // Adherence timer
      if ((order.status === 'packaging' || order.status === 'packed') && order.acceptedAt) {
        const startTime = new Date(order.acceptedAt).getTime();
        adherenceIntervals[order.id] = setInterval(() => {
          const now = Date.now();
          const elapsed = now - startTime;
          setAdherenceTimers(prev => ({ ...prev, [order.id]: elapsed }));
        }, 1000);
      }
    });
    return () => {
      Object.values(intervals).forEach(clearInterval);
      Object.values(adherenceIntervals).forEach(clearInterval);
    };
  }, [acceptedOrders, packedOrders]);

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getAdherenceStatus = (elapsed: number) => {
    const minutes = elapsed / 60000;
    if (minutes <= 10) return 'excellent';
    if (minutes <= 15) return 'good';
    if (minutes <= 20) return 'warning';
    return 'critical';
  };

  const simulateIncomingOrder = () => {
    const demoOrder = {
      id: `order-${Date.now()}`,
      customerName: `Customer ${Math.floor(Math.random() * 100)}`,
      items: ['Burger', 'Fries'],
      total: Math.floor(Math.random() * 500) + 100,
      timestamp: new Date(),
      status: 'pending' as const,
    };
    addIncomingOrder(demoOrder);
  };

  // Handler wrappers for UI actions
  const handleRejectOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to reject this order?')) rejectOrder(orderId);
  };

  const handleMarkPacked = (orderId: string) => {
    markOrderPacked(orderId);
  };

  const handleMarkInTransit = (orderId: string) => {
    markOrderInTransit(orderId);
  };

  const handleCompleteOrder = (orderId: string) => {
    completeOrder(orderId);
  };

  const handleMarkReturned = (orderId: string, fromPhase: 'transit' | 'completed') => {
    if (window.confirm('Mark this order as returned?')) {
      returnOrder(orderId, fromPhase);
    }
  };

  // Fetch order data by active phase from context
  const getPhaseData = () => {
    switch (activePhase) {
      case 'pending': return pendingOrders;
      case 'in-progress': return acceptedOrders.concat(packedOrders);
      case 'in-transit': return transitOrders;
      case 'returned': return returnedOrders;
      case 'completed': return completedOrders;
      default: return [];
    }
  };

  // Render order card UI
  const renderOrderCard = (order: any) => (
    <div key={order.id} className={`order-card ${order.status || activePhase} slide-in`}>
      <div className="order-info">
        <div className="order-header">
          <h3>{order.customerName}</h3>
          <span className={`status-badge ${order.status || activePhase}`}>
            {order.status === 'pending' && '⏳ Pending'}
            {order.status === 'packaging' && '👨‍🍳 Cooking'}
            {order.status === 'packed' && '📦 Packed'}
            {order.status === 'in-transit' && '🚚 In Transit'}
            {order.status === 'returned' && '↩️ Returned'}
            {order.status === 'completed' && '✅ Completed'}
          </span>
        </div>
        <p className="order-items">Items: {order.items.join(', ')}</p>
        <p className="order-total">Total: ₹{order.total}</p>
        <p className="order-time">
          Time: {order.timestamp.toLocaleTimeString()}
          {order.transitAt && ` | Transit: ${new Date(order.transitAt).toLocaleTimeString()}`}
          {order.completedAt && ` | Completed: ${new Date(order.completedAt).toLocaleTimeString()}`}
          {order.returnedAt && ` | Returned: ${new Date(order.returnedAt).toLocaleTimeString()}`}
        </p>
        {/* Packaging Timer */}
        {order.status === 'packaging' && timers[order.id] !== undefined && (
          <div className="timer packaging-timer">
            <span className="timer-label">⏰ Packaging Time:</span>
            <span className={`timer-value ${timers[order.id] < 60000 ? 'urgent' : ''}`}>
              {formatTime(timers[order.id])}
            </span>
          </div>
        )}
        {/* Adherence Timer */}
        {adherenceTimers[order.id] && (order.status === 'packaging' || order.status === 'packed') && (
          <div className="adherence-monitor">
            <span className="adherence-label">📊 Order Duration:</span>
            <span className={`adherence-time ${getAdherenceStatus(adherenceTimers[order.id])}`}>
              {formatTime(adherenceTimers[order.id])}
            </span>
            <div className={`adherence-indicator ${getAdherenceStatus(adherenceTimers[order.id])}`}>
              {getAdherenceStatus(adherenceTimers[order.id]) === 'excellent' && '🟢 Excellent'}
              {getAdherenceStatus(adherenceTimers[order.id]) === 'good' && '🟡 Good'}
              {getAdherenceStatus(adherenceTimers[order.id]) === 'warning' && '🟠 Warning'}
              {getAdherenceStatus(adherenceTimers[order.id]) === 'critical' && '🔴 Critical'}
            </div>
          </div>
        )}
      </div>
      <div className="action-buttons">
        {order.status === 'pending' && (
          <>
            <button onClick={() => acceptOrder(order.id)} className="accept-btn">✓ Accept Order</button>
            <button onClick={() => handleRejectOrder(order.id)} className="reject-btn">✗ Reject Order</button>
          </>
        )}
        {order.status === 'packaging' && (
          <button onClick={() => handleMarkPacked(order.id)} className="packed-btn">📦 Mark as Packed</button>
        )}
        {order.status === 'packed' && (
          <button onClick={() => handleMarkInTransit(order.id)} className="transit-btn">🚚 Send to Transit</button>
        )}
        {order.status === 'in-transit' && (
          <>
            <button onClick={() => handleCompleteOrder(order.id)} className="complete-btn">✅ Mark Delivered</button>
            <button onClick={() => handleMarkReturned(order.id, 'transit')} className="return-btn">↩️ Mark Returned</button>
          </>
        )}
        {order.status === 'completed' && (
          <button onClick={() => handleMarkReturned(order.id, 'completed')} className="return-btn">↩️ Mark Returned</button>
        )}
      </div>
    </div>
  );

  return (
    <div className="order-management">
      <audio ref={notificationAudioRef} src="/sounds/notification.mp3" preload="auto" />
      <div className="header">
        <h1>Order Management</h1>
        <button onClick={simulateIncomingOrder} className="demo-btn">📦 Simulate Incoming Order</button>
      </div>
      {/* Phase Navigation */}
      <div className="phase-navigation">
        {(['pending', 'in-progress', 'in-transit', 'returned', 'completed'] as OrderPhase[]).map(phase => (
          <button
            key={phase}
            className={`phase-tab ${activePhase === phase ? 'active' : ''}`}
            onClick={() => setActivePhase(phase)}
          >
            <span className="phase-icon">{phaseIconMap[phase]}</span>
            <span className="phase-label">{phaseMap[phase]}</span>
          </button>
        ))}
      </div>
      {/* Current Phase Orders */}
      <div className="current-phase">
        <h2 className={`phase-header ${activePhase}`}>
          <span className="section-icon">{phaseIconMap[activePhase]}</span>
          {phaseMap[activePhase]} ({getPhaseData().length})
        </h2>
        {getPhaseData().length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{phaseIconMap[activePhase]}</div>
            <p>No {phaseMap[activePhase].toLowerCase()} at the moment</p>
          </div>
        ) : (
          <div className="orders-container">
            {getPhaseData().map(order => renderOrderCard(order))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
