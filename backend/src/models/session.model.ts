import * as admin from "firebase-admin";
import QRCode from "qrcode";
import { rtdb } from "../infrastructure/firebase_RTDB.config";
import { CreateSession } from "../types/session";

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

      // セッション作成
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
      // ルーム情報を返す
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
  //   async updateRoom(id: string, room: UpdateRoom) {
  //     try {
  //
  //       });
  //       return updatedRoom;
  //     } catch (error) {
  //       throw new Error(`Error updating room ${error}`);
  //     }
  //   }
  //   }

  async getRoomById() {
    try {
      const roomsRef = rtdb.ref("rooms");
      const snapshot = await roomsRef.once("value");
      if (snapshot.exists()) {
        const rooms = snapshot.val();
        return rooms;
      }
    } catch (error) {
      throw new Error(`Error fetching room ${error}`);
    }
  }
  //   async deleteQuestion(id: string) {
  //     try {
  //     } catch (error) {
  //       throw new Error(`Error deleting room ${error}`);
  //     }
  //   }
}
