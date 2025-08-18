import React, { useEffect, useRef } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import './styles/RingNotification.css';

const RingNotification: React.FC = () => {
  const { playRing, stopRing, pendingOrders } = useNotifications();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (playRing && audioRef.current) {
      audioRef.current.play().catch(console.error);
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [playRing]);

  if (!playRing || pendingOrders.length === 0) return null;

  return (
    <div className="ring-notification-overlay">
      <div className="ring-notification-modal">
        <div className="ring-animation">
          <div className="ring-circle"></div>
          <div className="ring-circle ring-circle-2"></div>
          <div className="ring-circle ring-circle-3"></div>
        </div>

        <h2>🔔 New Order Incoming!</h2>
        <p>You have {pendingOrders.length} pending order(s)</p>

        <div className="order-preview">
          {pendingOrders.map(order => (
            <div key={order.id} className="order-item">
              <strong>{order.customerName}</strong>
              <span>₹{order.total}</span>
            </div>
          ))}
        </div>

        <button className="stop-ring-btn" onClick={stopRing}>
          Stop Ring
        </button>

        <audio ref={audioRef} loop preload="auto">
          <source src="/notification-sound.mp3" type="audio/mpeg" />
        </audio>
      </div>
    </div>
  );
};

export default RingNotification;
