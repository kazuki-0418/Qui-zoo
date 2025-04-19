"use client";
import { useParticipantStore } from "@/stores/participantStore";
import type React from "react";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import io, { type Socket } from "socket.io-client";
import { webSocketAppEvents } from "../constants/websocket-events";

interface WebSocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  joinSession: (joinUserInfo: JoinUserInfo) => void;
  leaveSession: (userInfo: LeaveUserInfo) => void;
}

type JoinUserInfo = {
  userId: string;
  sessionId: string;
  name: string;
  avatar: string;
  isGuest: boolean;
  roomCode: string;
};

type LeaveUserInfo = {
  sessionId: string;
  participantId: string;
  isHost: boolean;
};

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
  const {
    setParticipants,
    addParticipant,
    removeParticipant,
    setSessionId,
    setMyParticipantId,
    sessionId: activeSessionId,
  } = useParticipantStore();

  const connect = () => {
    if (typeof window !== "undefined" && !socket) {
      const socketInstance = io("http://localhost:4000");

      socketInstance.on(webSocketAppEvents.CONNECT, () => {
        setIsConnected(true);
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log("Connected to WebSocket server");
        if (activeSessionId) {
          socketInstance.emit(webSocketAppEvents.SESSION_DATA, { sessionId: activeSessionId });
        }
      });

      socketInstance.on(webSocketAppEvents.DISCONNECT, () => {
        setIsConnected(false);
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log("Disconnected from WebSocket server");
      });

      // 参加者リスト受信
      socketInstance.on(webSocketAppEvents.SESSION_DATA_RESPONSE, (data) => {
        if (data.participants && Array.isArray(data.participants)) {
          setParticipants(data.participants);
        }
      });
      // セッション参加成功
      socketInstance.on(webSocketAppEvents.SESSION_JOIN_SUCCESS, (data) => {
        setMyParticipantId(data.participantId);
        setSessionId(data.sessionId);

        if (data.participants && Array.isArray(data.participants)) {
          setParticipants(data.participants);
        }
      });

      // 新しい参加者の追加
      socketInstance.on(webSocketAppEvents.PARTICIPANT_JOINED, (participant) => {
        addParticipant(participant);
      });

      // 参加者の退出
      socketInstance.on(webSocketAppEvents.SESSION_LEAVE_SUCCESS, (data) => {
        removeParticipant(data.participantId);
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

  const joinSession = (userInfo: JoinUserInfo) => {
    if (socket) {
      socket.emit(webSocketAppEvents.SESSION_JOIN_REQUEST, userInfo);
    }
  };

  const leaveSession = (leaveUserInfo: LeaveUserInfo) => {
    if (socket) {
      socket.emit(webSocketAppEvents.SESSION_LEAVE_REQUEST, leaveUserInfo);
    }
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (typeof window !== "undefined" && !isConnected) {
      connect();
    }
  }, [isConnected]);

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
