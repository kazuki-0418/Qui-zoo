import { Server, Socket } from "socket.io";
import { participationController } from "../../controllers/participation.controller";
import { WebSocketEvents } from "../constants/websocket-events";

// ソケット拡張型を定義
interface AuthenticatedSocket extends Socket {
  userId: string;
}

// データ型定義
interface SessionJoinData {
  roomCode: string;
  sessionId: string;
  name: string;
  isGuest: boolean;
}

interface SessionLeaveData {
  sessionId: string;
  participantId: string;
}

export function registerNotificationHandlers(io: Server): void {
  io.on(WebSocketEvents.CONNECT, (socket: Socket) => {
    // セッション参加ハンドラー
    socket.on(WebSocketEvents.SESSION_JOIN, async (data: SessionJoinData) => {
      try {
        const { sessionId, name, isGuest, roomCode } = data;
        const userId = (socket as AuthenticatedSocket).userId; // ミドルウェアで設定されたユーザーID

        // 参加者データ作成
        const participantId = await participationController.joinRoom({
          sessionId,
          userId,
          name,
          isGuest,
          roomCode,
        });

        // 自分自身をセッションルームに参加させる
        socket.join(sessionId);

        // 他の参加者に通知
        socket.to(sessionId).emit(WebSocketEvents.PARTICIPANT_JOINED, {
          participantId,
          name,
          isGuest,
        });

        // 参加成功を自分に通知
        socket.emit(WebSocketEvents.SESSION_JOIN, {
          success: true,
          participantId,
          sessionId,
        });

        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(`User ${userId} joined session ${sessionId} as participant ${participantId}`);
      } catch (error) {
        console.error("Error joining session:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        socket.emit(WebSocketEvents.ERROR, { message: `Failed to join session: ${errorMessage}` });
      }
    });

    // セッション退出ハンドラー
    socket.on(WebSocketEvents.SESSION_LEAVE, async (data: SessionLeaveData) => {
      try {
        const { sessionId, participantId } = data;

        // 参加者データをオフラインに更新
        await participationController.leaveRoom({
          sessionId,
          participantId,
        });

        // セッションルームから退出
        socket.leave(sessionId);

        // 他の参加者に通知
        io.to(sessionId).emit(WebSocketEvents.PARTICIPANT_LEFT, { participantId });

        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(`Participant ${participantId} left session ${sessionId}`);
      } catch (error) {
        console.error("Error leaving session:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        socket.emit(WebSocketEvents.ERROR, { message: `Failed to leave session: ${errorMessage}` });
      }
    });
  });
}
