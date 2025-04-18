import { Request, Response } from "express";
import { rtdb } from "../infrastructure/firebase_RTDB.config";
import { RoomModel } from "../models/room.model";
import { SessionModel } from "../models/session.model";
import { CreateRoom } from "../types/room";

const roomModel = new RoomModel();
const sessionModel = new SessionModel();

class RoomController {
  async createRoom(req: Request<null, null, CreateRoom>, res: Response) {
    const roomConfig = req.body;
    try {
      const newRoom = await roomModel.createRoom(roomConfig);
      const session = await sessionModel.createSession({
        quizId: newRoom.roomId,
        roomId: newRoom.roomId,
      });

      const response = {
        roomId: newRoom.roomId,
        roomCode: newRoom.roomCode,
        sessionId: session.sessionId,
        joinUrl: session.joinUrl,
        qrCode: session.qrCode,
      };

      res.status(201).json(response);
    } catch (error) {
      console.error("Error creating room", error);
      res.status(500).json({ error: "Error creating room" });
    }
  }

  async validateRoomCode(req: Request, res: Response) {
    try {
      const { code } = req.params;

      const roomsRef = rtdb.ref("rooms");
      const snapshot = await roomsRef.orderByChild("code").equalTo(code).once("value");

      if (!snapshot.exists()) {
        return res.status(404).json({
          success: false,
          message: "Room not found",
        });
      }

      let roomData = null;
      let roomId = null;

      for (const childSnapshot of snapshot.val()) {
        if (!roomData && childSnapshot.val().isActive) {
          roomData = childSnapshot.val();
          roomId = childSnapshot.key;
        }
      }

      if (!roomData) {
        return res.status(404).json({
          success: false,
          message: "Room is not active",
        });
      }

      const sessionsRef = rtdb.ref("sessions");
      const sessionSnapshot = await sessionsRef
        .orderByChild("roomId")
        .equalTo(roomId)
        .once("value");
      let sessionId = null;

      for (const childSnapshot of sessionSnapshot.val()) {
        const sessionData = childSnapshot.val();
        if (sessionData.status === "waiting") {
          sessionId = childSnapshot.key;
        }
      }

      if (!sessionId) {
        return res.status(404).json({
          success: false,
          message: "No active waiting session found for this room",
        });
      }

      res.status(200).json({
        success: true,
        roomId,
        sessionId,
        allowGuests: roomData.allowGuests,
        quizId: roomData.quizId,
      });
    } catch (error) {
      console.error("Error validating room code:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

export const roomController = new RoomController();
