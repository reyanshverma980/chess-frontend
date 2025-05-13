import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:5001";

function useSocket() {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user?.userId) return;

    const socketInstance = io(WS_URL, {
      transports: ["websocket"],
      reconnection: true,
      auth: {
        userId: user?.userId,
      },
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user?.userId]);

  return socket;
}

export default useSocket;
