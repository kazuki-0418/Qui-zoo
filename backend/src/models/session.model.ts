import * as admin from "firebase-admin";
import QRCode from "qrcode";
import { rtdb } from "../infrastructure/firebase_RTDB.config";
import { CreateSession, Session } from "../types/session";

const generateUniqueCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

export class SessionModel {
  async createSession(sessionConfig: CreateSession) {
    try {
      const { quizId, roomId, questions } = sessionConfig;

      // Create Room Code
      const roomCode = generateUniqueCode();

      // create session
      const sessionRef = rtdb.ref("sessions").push();
      const sessionId = sessionRef.key;
      await sessionRef.set({
        id: sessionId,
        roomId,
        quizId,
        status: "waiting",
        currentQuestionIndex: 0,
        participants: null,
        startedAt: null,
        questions,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // TODO: Change this to your app URL
      const joinUrl = `https://your-app.com/rooms/${roomCode}`;

      // generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(joinUrl);

      return {
        quizId,
        roomId,
        roomCode,
        sessionId,
        joinUrl,
        qrCode: qrCodeDataUrl,
      };
    } catch (error) {
      throw new Error(`Error creating room ${error}`);
    }
  }

  async getSessionState(sessionId: string) {
    try {
      // セッションの現在の状態を取得
      const sessionRef = rtdb.ref(`sessions/${sessionId}`);
      const snapshot = await sessionRef.once("value");
      return snapshot.val()?.status || "waiting";
    } catch (error) {
      console.error("Error getting session state:", error);
      return "waiting";
    }
  }

  async getSessionByRoomId(roomId: string) {
    try {
      const sessionsRef = rtdb.ref("sessions");
      const sessionSnapshot = await sessionsRef
        .orderByChild("roomId")
        .equalTo(roomId)
        .once("value");

      if (sessionSnapshot.exists()) {
        return Object.entries(sessionSnapshot.val()).map(([key, value]) => ({
          ...(value as Session),
          id: key,
        })) as Session[];
      }

      return null;
    } catch (error) {
      throw new Error(`Error fetching session ${error}`);
    }
  }
}
