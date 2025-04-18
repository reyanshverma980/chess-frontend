import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:5001";
const MAX_RECONNECT_DELAY = 16000;

function useSocket() {
  const { token } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const reconnectDelay = useRef(1000); // Start with 1 second
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const reconnectRef = useRef<boolean>(true);

  const connect = () => {
    if (!token) return;

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      setSocket(ws);
      reconnectDelay.current = 1000; // Reset delay on successful connection
      ws.send(JSON.stringify({ type: "auth", token }));
    };

    ws.onclose = () => {
      setSocket(null);

      if (reconnectRef.current) {
        reconnectTimeout.current = setTimeout(() => {
          reconnectDelay.current = Math.min(
            reconnectDelay.current * 2,
            MAX_RECONNECT_DELAY
          );
          connect(); // Try again after waiting
        }, reconnectDelay.current);
      }
    };

    return ws;
  };

  useEffect(() => {
    if (!token) return; // Prevent connecting without a token

    const ws = connect();

    return () => {
      reconnectRef.current = false; // Prevent reconnection after unmount
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      ws?.close();
    };
  }, []);

  return socket;
}

export default useSocket;
