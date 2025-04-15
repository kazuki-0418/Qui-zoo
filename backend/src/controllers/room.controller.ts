import { Request, Response } from "express";
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
}

export const roomController = new RoomController();
