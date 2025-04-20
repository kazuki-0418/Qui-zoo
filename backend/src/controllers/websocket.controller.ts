import { ParticipantModel } from "../models/participant.model";
import { RoomModel } from "../models/room.model";
import { SessionModel } from "../models/session.model";
import { CreateParticipant } from "../types/participants";

const participantModel = new ParticipantModel();
const roomModel = new RoomModel();
const sessionModel = new SessionModel();

class WebSocketController {
  async getParticipantById({
    sessionId,
    participantId,
  }: {
    sessionId: string;
    participantId: string;
  }) {
    try {
      const participants = await participantModel.getParticipants(sessionId);
      if (!participants) {
        throw new Error("Participant not found");
      }

      const participant = participants.find((p) => p.id === participantId);
      if (!participant) {
        throw new Error("Participant not found");
      }
      return participant;
    } catch (error) {
      console.error("Error getting participant by ID:", error);
      throw error;
    }
  }

  async getParticipants(sessionId: string) {
    try {
      const participants = await participantModel.getParticipants(sessionId);
      return participants;
    } catch (error) {
      console.error("Error getting participants:", error);
      throw error;
    }
  }

  async getSessionState(sessionId: string) {
    try {
      const sessionState = await sessionModel.getSessionState(sessionId);
      return sessionState;
    } catch (error) {
      console.error("Error getting session state:", error);
      throw error;
    }
  }

  async joinRoom(participantConfig: CreateParticipant) {
    const { roomCode, name, avatar, isGuest, userId = null, socketId } = participantConfig;

    // ルーム情報取得
    const availableRooms = await roomModel.getRoomByCode(roomCode);
    const roomData = availableRooms[0];
    const roomId = roomData.id;
    if (isGuest && !roomData.allowGuests) {
      throw new Error("Guests are not allowed in this room");
    }
    const sessionData = await sessionModel.getSessionByRoomId(roomId);
    if (sessionData === null || sessionData.length === 0) {
      throw new Error("Session not found");
    }

    const session = sessionData[0];
    const sessionId = session.id;

    const participantId = await participantModel.createParticipant({
      sessionId,
      userId,
      name,
      avatar,
      isGuest,
      roomCode,
      socketId,
    });

    if (!participantId) {
      throw new Error("Failed to create participant");
    }
    return {
      participantId,
      sessionId,
    };
  }

  async leaveRoom(participantState: {
    sessionId: string;
    participantId: string;
  }) {
    const { sessionId, participantId } = participantState;
    try {
      await participantModel.deleteParticipant({
        sessionId,
        participantId,
        isOnline: false,
      });
    } catch (error) {
      console.error("Error leaving room", error);
    }
  }

  async closeSession(sessionId: string) {
    try {
      const session = await sessionModel.getSessionById(sessionId);
      if (!session) {
        throw new Error("Session not found");
      }
      await sessionModel.closeSession(sessionId);
    } catch (error) {
      console.error("Error closing session", error);
    }
  }
}

export const websocketController = new WebSocketController();
