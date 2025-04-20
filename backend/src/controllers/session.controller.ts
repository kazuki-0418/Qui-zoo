import { Request, Response } from "express";
import { RoomModel } from "../models/room.model";
import { SessionModel } from "../models/session.model";
import { Session } from "../types/session";

const roomModel = new RoomModel();
const sessionModel = new SessionModel();

class SessionController {
  async duplicateUsername(req: Request, res: Response) {
    try {
      const { room_code } = req.params;

      const availableRooms = await roomModel.getRoomByCode(room_code);
      if (availableRooms.length === 0) {
        res.status(404).json({
          success: false,
          message: "Room not found or inactive",
        });
      }

      const availableSession = await sessionModel.getSessionByRoomId(availableRooms[0].id);
      if (!availableSession) {
        res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }

      const sessionValues = Object.values(availableSession ?? {}) as unknown as Session[];

      if (!sessionValues[0]) {
        res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }

      const sessionObj: Session = sessionValues[0];

      if (sessionObj.status !== "waiting") {
        res.status(400).json({
          success: false,
          message: "Session is not in waiting status",
        });
      }

      res.status(200).json({
        currentQuestionIndex: sessionValues[0].currentQuestionIndex,
        success: true,
        roomId: availableRooms[0].id,
        allowGuests: availableRooms[0].allowGuests,
        quizId: availableRooms[0].quizId,
        sessionId: sessionObj.id || null,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }
}

export const sessionController = new SessionController();
