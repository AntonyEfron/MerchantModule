import React, { useState } from "react";
import { connectSocket, disconnectSocket } from "../../utils/socket";

const OnlineToggle = ({ merchantId }: { merchantId: string }) => {
  const [online, setOnline] = useState(false);

  const handleToggle = () => {
    if (!online) {
        console.log(merchantId);
        
      connectSocket(merchantId); // connect socket
    } else {
      disconnectSocket(); // disconnect socket
    }
    setOnline(!online);
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-4 py-2 rounded-lg ${
        online ? "bg-green-500" : "bg-gray-400"
      }`}
    >
      {online ? "Go Offline" : "Go Online"}
    </button>
  );
};

export default OnlineToggle;
