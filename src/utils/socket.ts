import { io, Socket } from "socket.io-client";
import mitt from "mitt";
let socket: Socket | null = null;

export const emitter = mitt();

export const connectSocket = (merchantId: string) => {
  socket = io("http://192.168.29.230:5000", {
    transports: ["websocket"],
    query: { merchantId }, // pass merchantId for backend mapping
  });

  socket.on("connect", () => {
    console.log("✅ Connected to socket:", socket?.id);
    console.log("✅ Emitting registerMerchant event", merchantId);
    socket?.emit("registerMerchant", merchantId);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from socket");
  });

    // 🔹 Listen for order updates globally
    socket.on("orderUpdate", (order) => {
      console.log("📦 Order update received:", order);
      emitter.emit("orderUpdate", order); // re-emit for components
    });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
