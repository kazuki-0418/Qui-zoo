import http from "node:http";
import { Server } from "socket.io";
import { registerCoreHandlers } from "./core";
import { registerDomainHandlers } from "./domains/index";
import { applyMiddleware } from "./middleware";

let io: Server | null = null;

/**
 * WebSocketサーバーの初期化
 * @param {http.Server} httpServer - HTTPサーバーインスタンス
 */
export function initializeWebSocketServer(httpServer: http.Server) {
  io = new Server(httpServer, {
    path: "/socket.io/",
    transports: ["websocket", "polling"],
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // ミドルウェアを適用
  applyMiddleware(io);

  // コアハンドラーを登録
  registerCoreHandlers(io);

  // ドメイン別ハンドラーを登録
  registerDomainHandlers(io);

  return io;
}

/**
 * グローバルなio参照を取得
 * @returns {Server} Socket.ioサーバーインスタンス
 */
export function getIO() {
  if (!io) {
    throw new Error("WebSocket server not initialized.");
  }
  return io;
}
