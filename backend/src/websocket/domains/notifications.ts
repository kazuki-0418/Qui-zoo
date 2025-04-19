import { Server, Socket } from "socket.io";
import { websocketController } from "../../controllers/websocket.controller";
import { webSocketAppEvents } from "../constants/websocket-events";

// ソケット拡張型を定義
// interface AuthenticatedSocket extends Socket {
//   userId: string;
// }

// データ型定義
interface SessionJoinData {
  userId: string;
  roomCode: string;
  sessionId: string;
  name: string;
  avatar: string;
  isGuest: boolean;
}

interface SessionLeaveData {
  sessionId: string;
  participantId: string;
  isHost: boolean;
}

export function registerNotificationHandlers(io: Server): void {
  io.on(webSocketAppEvents.CONNECT, (socket: Socket) => {
    socket.on(webSocketAppEvents.SESSION_DATA, async (data: { sessionId: string }) => {
      try {
        const { sessionId } = data;

        // セッション内の全参加者情報を取得
        const participantsList = await websocketController.getParticipants(sessionId);

        // セッション情報と現在の参加者リストをクライアントに送信
        socket.emit(webSocketAppEvents.SESSION_DATA_RESPONSE, {
          participants: participantsList,
          sessionId,
          // 必要に応じて他のセッション情報も追加
          currentState: await websocketController.getSessionState(sessionId),
        });

        // セッションルームに参加
        socket.join(sessionId);
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(`Client ${socket.id} joined room ${sessionId} via SESSION_DATA`);
      } catch (error) {
        console.error("Error fetching session data:", error);
        socket.emit(webSocketAppEvents.ERROR, {
          message: `Failed to fetch session data: ${error instanceof Error ? error.message : String(error)}`,
        });
      }
    });
    // セッション参加ハンドラー
    socket.on(webSocketAppEvents.SESSION_JOIN_REQUEST, async (data: SessionJoinData) => {
      try {
        const { sessionId, userId, name, avatar, isGuest } = data;
        const participantId = await websocketController.joinRoom(data);

        // 自分自身をセッションルームに参加させる
        socket.join(sessionId);

        // 他の参加者に通知（自分以外）
        io.to(sessionId).emit(webSocketAppEvents.PARTICIPANT_JOINED, {
          participantId,
          name,
          avatar,
          isGuest,
        });

        const allParticipants = await websocketController.getParticipants(sessionId);

        // 参加成功を自分に通知（全参加者リストを含める）
        io.to(sessionId).emit(webSocketAppEvents.SESSION_JOIN_SUCCESS, {
          success: true,
          participantId,
          sessionId,
          participants: allParticipants,
        });

        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(`User ${userId} joined session ${sessionId} as participant ${participantId}`);
      } catch (error) {
        console.error("Error joining session:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        socket.emit(webSocketAppEvents.ERROR, {
          message: `Failed to join session: ${errorMessage}`,
        });
      }
    });

    // セッション退出ハンドラー host 専用
    socket.on(webSocketAppEvents.SESSION_LEAVE_REQUEST, async (data: SessionLeaveData) => {
      try {
        const { sessionId, participantId, isHost } = data;

        // セッションルームから退出

        io.to(sessionId).emit(webSocketAppEvents.PARTICIPANT_LEFT, { participantId });

        io.to(sessionId).emit(webSocketAppEvents.SESSION_LEAVE_SUCCESS, {
          success: true,
          participantId,
        });

        // 参加者データをオフラインに更新
        await websocketController.leaveRoom({
          sessionId,
          participantId,
        });

        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(`Participant ${participantId} left session ${sessionId}`);
        if (!isHost) {
          socket.leave(sessionId);
        }
      } catch (error) {
        console.error("Error leaving session:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        socket.emit(webSocketAppEvents.ERROR, {
          message: `Failed to leave session: ${errorMessage}`,
        });
      }
    });
  });
}
