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

// type ParticipantOnlineConfig = {
//   sessionId: string;
//   participantId: string;
//   isOnline: boolean;
// };

// const rtdb = admin.database();

/**
 * 通知関連のWebSocketハンドラー登録
 * @param {Server} io - Socket.ioサーバーインスタンス
 */
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
        socket.emit("joinedSession", {
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

// /**
//  * 参加者データを作成する
//  * @param sessionId セッションID
//  * @param userId ユーザーID
//  * @param displayName 表示名
//  * @param isGuest ゲストかどうか
//  * @returns 作成された参加者ID
//  */
// async function createParticipant(
//   sessionId: string,
//   userId: string,
//   displayName: string,
//   isGuest: boolean,
// ): Promise<string> {
//   try {
//     // 重複名チェック
//     const isDuplicateName = await checkDuplicateName(sessionId, displayName);
//     if (isDuplicateName) {
//       throw new Error("この名前は既に使用されています。別の名前を選択してください。");
//     }

//     // 参加者データ作成
//     const participantsRef = rtdb.ref("sessions").child(sessionId).child("participants");
//     const newParticipantRef = participantsRef.push();
//     const participantId = newParticipantRef.key as string;

//     const now = admin.database.ServerValue.TIMESTAMP;

//     await newParticipantRef.set({
//       id: participantId,
//       userId: userId,
//       name: displayName,
//       isGuest: isGuest,
//       isOnline: true,
//       avatar: "", // 必要に応じて設定
//       joinedAt: now,
//       score: 0,
//     });

//     // presence情報も同時に更新
//     const presenceRef = rtdb.ref("presence").child(sessionId).child(participantId);
//     await presenceRef.set({
//       online: true,
//       lastActive: now,
//     });

//     // 切断時の処理を設定
//     presenceRef.onDisconnect().update({
//       online: false,
//       lastActive: admin.database.ServerValue.TIMESTAMP,
//     });

//     return participantId;
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     throw new Error(`Error creating participant: ${errorMessage}`);
//   }
// }

// /**
//  * 重複名をチェックする
//  * @param sessionId セッションID
//  * @param displayName チェックする表示名
//  * @returns 重複がある場合はtrue
//  */
// async function checkDuplicateName(sessionId: string, displayName: string): Promise<boolean> {
//   try {
//     const participantsRef = rtdb.ref("sessions").child(sessionId).child("participants");
//     const duplicateNameSnapshot = await participantsRef
//       .orderByChild("name")
//       .equalTo(displayName)
//       .once("value");

//     return duplicateNameSnapshot.exists();
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     throw new Error(`Error checking duplicate name: ${errorMessage}`);
//   }
// }

// /**
//  * セッションの参加者数を増加させる
//  * @param sessionId セッションID
//  * @returns 成功した場合はtrue
//  */
// async function incrementSessionParticipantCount(sessionId: string): Promise<boolean> {
//   try {
//     const sessionRef = rtdb.ref(`sessions/${sessionId}`);

//     // トランザクションを使用して参加者数をアトミックに増加
//     await sessionRef.child("participantCount").transaction((currentCount) => {
//       return (currentCount || 0) + 1;
//     });

//     return true;
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     throw new Error(`Error updating participant count: ${errorMessage}`);
//   }
// }

// /**
//  * 参加者のオンラインステータスを更新する
//  * @param participantConfig 参加者設定
//  */
// async function updateParticipantOnlineStatus(
//   participantConfig: ParticipantOnlineConfig,
// ): Promise<void> {
//   const { sessionId, participantId, isOnline } = participantConfig;
//   try {
//     const now = admin.database.ServerValue.TIMESTAMP;

//     // 参加者データ更新
//     const participantRef = rtdb.ref(`sessions/${sessionId}/participants/${participantId}`);
//     await participantRef.update({
//       isOnline: isOnline,
//       lastActive: now,
//     });

//     // presence情報更新
//     const presenceRef = rtdb.ref(`presence/${sessionId}/${participantId}`);
//     await presenceRef.update({
//       online: isOnline,
//       lastActive: now,
//     });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     throw new Error(`Error updating participant online status: ${errorMessage}`);
//   }
// }
