import { useNotifications } from "../../../context/NotificationContext";

const NotificationBell = () => {
  const { newOrderCount } = useNotifications();

  return (
    <button>
      🔔 {newOrderCount > 0 && <span>{newOrderCount}</span>}
    </button>
  );
};

export default NotificationBell;
