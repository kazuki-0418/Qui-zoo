import type React from "react";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import io, { type Socket } from "socket.io-client";
import { WebSocketEvents } from "../constants/websocket-events";

interface WebSocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  joinSession: (sessionId: string, displayName: string, isGuest: boolean) => void;
  leaveSession: (sessionId: string, participantId: string) => void;
}

const webSocketContext = createContext<WebSocketContextValue>({
  socket: null,
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
  joinSession: () => {},
  leaveSession: () => {},
});

// biome-ignore lint/style/useNamingConvention: <explanation>
export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = () => {
    if (typeof window !== "undefined" && !socket) {
      const socketInstance = io(process.env.BACKEND_URL || "http://localhost:4000");

      socketInstance.on(WebSocketEvents.CONNECT, () => {
        setIsConnected(true);
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log("Connected to WebSocket server");
      });

      socketInstance.on(WebSocketEvents.DISCONNECT, () => {
        setIsConnected(false);
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log("Disconnected from WebSocket server");
      });

      setSocket(socketInstance);
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const joinSession = (sessionId: string, displayName: string, isGuest: boolean) => {
    if (socket) {
      socket.emit(WebSocketEvents.SESSION_JOIN, {
        sessionId,
        displayName,
        isGuest,
      });
    }
  };

  const leaveSession = (sessionId: string, participantId: string) => {
    if (socket) {
      socket.emit(WebSocketEvents.SESSION_LEAVE, {
        sessionId,
        participantId,
      });
    }
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const value = {
    socket,
    isConnected,
    connect,
    disconnect,
    joinSession,
    leaveSession,
  };

  return <webSocketContext.Provider value={value}>{children}</webSocketContext.Provider>;
};

// biome-ignore lint/nursery/useComponentExportOnlyModules: <explanation>
export const useWebSocket = () => useContext(webSocketContext);
