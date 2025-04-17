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
      const { quizId, roomId } = sessionConfig;

      // Create Room Code
      const roomCode = generateUniqueCode();

      // create session
      const sessionRef = rtdb.ref("sessions").push();
      await sessionRef.set({
        id: sessionRef.key,
        roomId,
        quizId,
        status: "waiting",
        currentQuestionIndex: 0,
        startedAt: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      const joinUrl = `https://your-app.com/rooms/${roomCode}`;

      // generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(joinUrl);

      return {
        roomId: roomId,
        roomCode,
        sessionId: sessionRef.key,
        joinUrl,
        qrCode: qrCodeDataUrl,
      };
    } catch (error) {
      throw new Error(`Error creating room ${error}`);
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
        return sessionSnapshot.val() as Session;
      }

      return null;
    } catch (error) {
      throw new Error(`Error fetching session ${error}`);
    }
  }
}
