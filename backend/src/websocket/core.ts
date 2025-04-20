import { Server, Socket } from "socket.io";
import { webSocketCoreEvents } from "./constants/websocket-events";

/**
 * WebSocketコアハンドラー登録
 * @param {Server} io - Socket.ioサーバーインスタンス
 */
export function registerCoreHandlers(io: Server): void {
  io.on(webSocketCoreEvents.CONNECT, (socket: Socket) => {
    // biome-ignore lint/suspicious/noConsoleLog:
    console.log(`Client connected: ${socket.id}`);

    // ルーム参加ハンドラー
    socket.on(webSocketCoreEvents.JOIN_ROOM, async (roomId: string) => {
      try {
        // 既存の全てのルームから退出
        for (const room of socket.rooms) {
          if (room !== socket.id) {
            socket.leave(room);
          }
        }

        // 新しいルームに参加
        socket.join(roomId);
        // biome-ignore lint/suspicious/noConsoleLog:
        console.log(`Client ${socket.id} joined room: ${roomId}`);

        // 参加者数更新のイベントをブロードキャスト
        const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;
        io.to(roomId).emit("roomParticipantCount", { count: roomSize });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        socket.emit(webSocketCoreEvents.ERROR, {
          message: `Failed to join room: ${errorMessage}`,
        });
      }
    });

    // ルーム退出ハンドラー
    socket.on(webSocketCoreEvents.LEAVE_ROOM, (roomId: string) => {
      socket.leave(roomId);
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log(`Client ${socket.id} left room: ${roomId}`);

      // 参加者数更新のイベントをブロードキャスト
      const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;
      io.to(roomId).emit("roomParticipantCount", { count: roomSize });
    });

    // 切断ハンドラー
    socket.on(webSocketCoreEvents.DISCONNECT, (reason: string) => {
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);

      // 必要に応じて切断時の処理を追加
      // 例: プレゼンス更新、タイムアウト処理など
    });

    // エラーハンドラー
    socket.on("error", (error: Error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });
}
