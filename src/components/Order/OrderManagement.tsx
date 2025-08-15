// components/OrderManagement/OrderManagement.tsx
import React, { useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import './styles/OrderManagement.css';

type OrderPhase = 'pending' | 'in-progress' | 'in-transit' | 'returned' | 'completed';

const OrderManagement: React.FC = () => {
  const { 
    pendingOrders, 
    acceptedOrders, 
    acceptOrder, 
    rejectOrder,
    markOrderPacked, 
    completePackaging,
    addIncomingOrder 
  } = useNotifications();

  const [activePhase, setActivePhase] = useState<OrderPhase>('pending');
  const [timers, setTimers] = useState<Record<string, number>>({});
  const [adherenceTimers, setAdherenceTimers] = useState<Record<string, number>>({});

  // Mock data for transit, returned, and completed orders
  const [transitOrders, setTransitOrders] = useState<any[]>([]);
  const [returnedOrders, setReturnedOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);

  useEffect(() => {
    const intervals: Record<string, NodeJS.Timeout> = {};
    const adherenceIntervals: Record<string, NodeJS.Timeout> = {};

    acceptedOrders.forEach(order => {
      // Original packaging timer
      if (order.status === 'packaging' && order.acceptedAt) {
        const startTime = new Date(order.acceptedAt).getTime();
        const endTime = startTime + (10 * 60 * 1000); // 10 minutes

        intervals[order.id] = setInterval(() => {
          const now = Date.now();
          const remaining = Math.max(0, endTime - now);
          
          setTimers(prev => ({
            ...prev,
            [order.id]: remaining
          }));

          if (remaining === 0) {
            clearInterval(intervals[order.id]);
          }
        }, 1000);
      }

      // Adherence monitoring timer
      if ((order.status === 'packaging' || order.status === 'packed') && order.acceptedAt) {
        const startTime = new Date(order.acceptedAt).getTime();

        adherenceIntervals[order.id] = setInterval(() => {
          const now = Date.now();
          const elapsed = now - startTime;
          
          setAdherenceTimers(prev => ({
            ...prev,
            [order.id]: elapsed
          }));
        }, 1000);
      }
    });

    return () => {
      Object.values(intervals).forEach(clearInterval);
      Object.values(adherenceIntervals).forEach(clearInterval);
    };
  }, [acceptedOrders]);

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
      status: 'pending' as const
    };
    addIncomingOrder(demoOrder);
  };

  const handleRejectOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to reject this order?')) {
      rejectOrder(orderId);
    }
  };

  const handleMarkPacked = (orderId: string) => {
    markOrderPacked(orderId);
  };

  const handleMarkInTransit = (orderId: string) => {
    const order = acceptedOrders.find(o => o.id === orderId);
    if (order) {
      const transitOrder = {
        ...order,
        status: 'in-transit',
        transitAt: new Date()
      };
      setTransitOrders(prev => [...prev, transitOrder]);
      // Remove from accepted orders (this would be handled by your context)
    }
  };

  const handleMarkReturned = (orderId: string, fromPhase: 'transit' | 'completed') => {
    if (window.confirm('Mark this order as returned?')) {
      let order;
      if (fromPhase === 'transit') {
        order = transitOrders.find(o => o.id === orderId);
        setTransitOrders(prev => prev.filter(o => o.id !== orderId));
      } else {
        order = completedOrders.find(o => o.id === orderId);
        setCompletedOrders(prev => prev.filter(o => o.id !== orderId));
      }
      
      if (order) {
        const returnedOrder = {
          ...order,
          status: 'returned',
          returnedAt: new Date()
        };
        setReturnedOrders(prev => [...prev, returnedOrder]);
      }
    }
  };

  const handleCompleteOrder = (orderId: string) => {
    const order = transitOrders.find(o => o.id === orderId);
    if (order) {
      const completedOrder = {
        ...order,
        status: 'completed',
        completedAt: new Date()
      };
      setCompletedOrders(prev => [...prev, completedOrder]);
      setTransitOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };

  const getPhaseData = () => {
    switch (activePhase) {
      case 'pending':
        return pendingOrders;
      case 'in-progress':
        return acceptedOrders;
      case 'in-transit':
        return transitOrders;
      case 'returned':
        return returnedOrders;
      case 'completed':
        return completedOrders;
      default:
        return [];
    }
  };

  const getPhaseTitle = () => {
    switch (activePhase) {
      case 'pending':
        return 'Pending Orders';
      case 'in-progress':
        return 'In Progress';
      case 'in-transit':
        return 'In Transit';
      case 'returned':
        return 'Returned Orders';
      case 'completed':
        return 'Completed Orders';
    }
  };

  const getPhaseIcon = () => {
    switch (activePhase) {
      case 'pending':
        return '⏳';
      case 'in-progress':
        return '👨‍🍳';
      case 'in-transit':
        return '🚚';
      case 'returned':
        return '↩️';
      case 'completed':
        return '✅';
    }
  };

  const renderOrderCard = (order: any) => {
    return (
      <div key={order.id} className={`order-card ${order.status || activePhase} slide-in`}>
        <div className="order-info">
          <div className="order-header">
            <h3>{order.customerName}</h3>
            <span className={`status-badge ${order.status || activePhase}`}>
              {activePhase === 'pending' && '⏳ Pending'}
              {order.status === 'packaging' && '👨‍🍳 Cooking'}
              {order.status === 'packed' && '📦 Packed'}
              {activePhase === 'in-transit' && '🚚 In Transit'}
              {activePhase === 'returned' && '↩️ Returned'}
              {activePhase === 'completed' && '✅ Completed'}
            </span>
          </div>
          <p className="order-items">Items: {order.items.join(', ')}</p>
          <p className="order-total">Total: ₹{order.total}</p>
          <p className="order-time">
            Time: {order.timestamp.toLocaleTimeString()}
            {order.transitAt && ` | Transit: ${order.transitAt.toLocaleTimeString()}`}
            {order.completedAt && ` | Completed: ${order.completedAt.toLocaleTimeString()}`}
            {order.returnedAt && ` | Returned: ${order.returnedAt.toLocaleTimeString()}`}
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

          {/* Adherence Monitoring Timer */}
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
          {activePhase === 'pending' && (
            <>
              <button 
                onClick={() => acceptOrder(order.id)}
                className="accept-btn"
              >
                <span className="btn-icon">✓</span>
                Accept Order
              </button>
              <button 
                onClick={() => handleRejectOrder(order.id)}
                className="reject-btn"
              >
                <span className="btn-icon">✗</span>
                Reject Order
              </button>
            </>
          )}

          {order.status === 'packaging' && (
            <button 
              onClick={() => handleMarkPacked(order.id)}
              className="packed-btn"
            >
              <span className="btn-icon">📦</span>
              Mark as Packed
            </button>
          )}
          
          {order.status === 'packed' && (
            <button 
              onClick={() => handleMarkInTransit(order.id)}
              className="transit-btn"
            >
              <span className="btn-icon">🚚</span>
              Send to Transit
            </button>
          )}

          {activePhase === 'in-transit' && (
            <>
              <button 
                onClick={() => handleCompleteOrder(order.id)}
                className="complete-btn"
              >
                <span className="btn-icon">✅</span>
                Mark Delivered
              </button>
              <button 
                onClick={() => handleMarkReturned(order.id, 'transit')}
                className="return-btn"
              >
                <span className="btn-icon">↩️</span>
                Mark Returned
              </button>
            </>
          )}

          {activePhase === 'completed' && (
            <button 
              onClick={() => handleMarkReturned(order.id, 'completed')}
              className="return-btn"
            >
              <span className="btn-icon">↩️</span>
              Mark Returned
            </button>
          )}

          {activePhase === 'returned' && (
            <div className="return-info">
              <span className="return-reason">Reason: Customer Request</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="order-management">
      <div className="header">
        <h1>Order Management</h1>
        <button onClick={simulateIncomingOrder} className="demo-btn">
          <span className="btn-icon">📦</span>
          Simulate Incoming Order
        </button>
      </div>

      {/* Phase Navigation */}
      <div className="phase-navigation">
        <button 
          className={`phase-tab ${activePhase === 'pending' ? 'active' : ''}`}
          onClick={() => setActivePhase('pending')}
        >
          <span className="phase-icon">⏳</span>
          <span className="phase-label">Pending</span>
          {pendingOrders.length > 0 && <span className="phase-count">{pendingOrders.length}</span>}
        </button>
        <button 
          className={`phase-tab ${activePhase === 'in-progress' ? 'active' : ''}`}
          onClick={() => setActivePhase('in-progress')}
        >
          <span className="phase-icon">👨‍🍳</span>
          <span className="phase-label">In Progress</span>
          {acceptedOrders.length > 0 && <span className="phase-count">{acceptedOrders.length}</span>}
        </button>
        <button 
          className={`phase-tab ${activePhase === 'in-transit' ? 'active' : ''}`}
          onClick={() => setActivePhase('in-transit')}
        >
          <span className="phase-icon">🚚</span>
          <span className="phase-label">In Transit</span>
          {transitOrders.length > 0 && <span className="phase-count">{transitOrders.length}</span>}
        </button>
        <button 
          className={`phase-tab ${activePhase === 'returned' ? 'active' : ''}`}
          onClick={() => setActivePhase('returned')}
        >
          <span className="phase-icon">↩️</span>
          <span className="phase-label">Returned</span>
          {returnedOrders.length > 0 && <span className="phase-count">{returnedOrders.length}</span>}
        </button>
        <button 
          className={`phase-tab ${activePhase === 'completed' ? 'active' : ''}`}
          onClick={() => setActivePhase('completed')}
        >
          <span className="phase-icon">✅</span>
          <span className="phase-label">Completed</span>
          {completedOrders.length > 0 && <span className="phase-count">{completedOrders.length}</span>}
        </button>
      </div>

      {/* Current Phase Orders */}
      <div className="current-phase">
        <h2 className={`phase-header ${activePhase}`}>
          <span className="section-icon">{getPhaseIcon()}</span>
          {getPhaseTitle()} ({getPhaseData().length})
        </h2>
        
        {getPhaseData().length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{getPhaseIcon()}</div>
            <p>No {getPhaseTitle().toLowerCase()} at the moment</p>
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