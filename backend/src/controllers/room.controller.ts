import { Request, Response } from "express";
import { ParticipantModel } from "../models/participant.model";
import { QuestionModel } from "../models/question.model";
import { RoomModel } from "../models/room.model";
import { SessionModel } from "../models/session.model";
import { CreateRoom } from "../types/room";
import { Session } from "../types/session";

const roomModel = new RoomModel();
const sessionModel = new SessionModel();
const participantModel = new ParticipantModel();
const questionModel = new QuestionModel();

class RoomController {
  async createRoom(req: Request<null, null, CreateRoom>, res: Response) {
    const roomConfig = req.body;
    try {
      const questions = await questionModel.getAllQuestionsByQuizId(roomConfig.quizId);
      if (questions.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No questions found for the quiz",
        });
      }

      function getRandomQuestions(count = 5) {
        const numToGet = Math.min(count, questions.length);

        const indices = [...Array(questions.length).keys()];
        const result = [];

        for (let i = 0; i < numToGet; i++) {
          const randomPosition = Math.floor(Math.random() * indices.length);
          if (indices.length === 0) {
            break; // No more indices to select from
          }
          const selectedIndex = indices[randomPosition];
          result.push(questions[selectedIndex]);

          // Remove the selected index to avoid duplicates
          indices.splice(randomPosition, 1);
        }

        return result;
      }

      const questionData = getRandomQuestions(5);

      const newRoom = await roomModel.createRoom(roomConfig);
      const session = await sessionModel.createSession({
        quizId: roomConfig.quizId,
        roomId: newRoom.roomId,
        questions: questionData,
      });

      const response = {
        roomId: newRoom.roomId,
        roomCode: newRoom.roomCode,
        sessionId: session.sessionId,
        joinUrl: session.joinUrl,
        qrCode: session.qrCode,
        questions: questionData,
      };

      res.status(201).json(response);
    } catch (error) {
      console.error("Error creating room", error);
      res.status(500).json({ error: "Error creating room" });
    }
  }

  async getRooms(_: Request, res: Response) {
    try {
      const rooms = await roomModel.getRooms();
      res.status(200).json(rooms);
    } catch (error) {
      console.error("Error fetching rooms", error);
      res.status(500).json({ error: "Error fetching rooms" });
    }
  }

  async validateRoomCode(req: Request, res: Response) {
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

  async joinRoom(req: Request, res: Response) {
    const { roomCode, name, avatar, isGuest, userId = null } = req.body;

    // ルーム情報取得
    const availableRooms = await roomModel.getRoomByCode(roomCode);
    const roomData = availableRooms[0];
    const roomId = roomData.id;
    if (isGuest && !roomData.allowGuests) {
      return res.status(403).json({
        success: false,
        message: "Guest participation is not allowed in this room",
      });
    }
    const sessionData = await sessionModel.getSessionByRoomId(roomId);
    if (sessionData === null || sessionData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const session = sessionData[0];

    const participantId = await participantModel.createParticipant({
      sessionId: session?.id,
      userId,
      name,
      avatar,
      isGuest,
      roomCode,
    });

    if (!participantId) {
      return res.status(500).json({
        success: false,
        message: "Error creating participant",
      });
    }
  }

  async leaveRoom(req: Request, res: Response) {
    try {
      await participantModel.updateParticipantOnlineStatus({
        sessionId: req.body.sessionId,
        participantId: req.body.participantId,
        isOnline: false,
      });
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error leaving room", error);
      res.status(500).json({ success: false, message: error });
    }
  }
}

export const roomController = new RoomController();
