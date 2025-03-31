import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:5001";

function useSocket() {
  const { token } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const reconnectRef = useRef<boolean>(true);

  useEffect(() => {
    if (!token) return; // Prevent connecting without a token

    const connectWebSocket = () => {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "auth", token }));
        setSocket(ws);
      };

      ws.onclose = () => {
        setSocket(null);

        if (reconnectRef.current) {
          setTimeout(connectWebSocket, 3000); // Reconnect only if component is still mounted
        }
      };

      return ws;
    };

    const ws = connectWebSocket();

    return () => {
      reconnectRef.current = false; // Prevent reconnection after unmount
      ws.close();
    };
  }, []);

  return socket;
}

export default useSocket;
