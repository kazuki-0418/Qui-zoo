import * as admin from "firebase-admin";
import { rtdb } from "../infrastructure/firebase_RTDB.config";
import { CreateRoom, Room } from "../types/room";

const generateUniqueCode = () => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  for (let i = 0; i < 4; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return code;
};

export class RoomModel {
  async createRoom(roomConfig: CreateRoom) {
    try {
      const { quizId, hostId, allowGuests } = roomConfig;

      // Create Room Code
      const roomCode = generateUniqueCode();

      // create room
      const roomRef = rtdb.ref("rooms").push();
      await roomRef.set({
        id: roomRef.key,
        code: roomCode,
        quizId,
        hostId,
        allowGuests,
        isActive: true,
        createdAt: admin.database.ServerValue.TIMESTAMP,
      });

      return {
        roomId: roomRef.key,
        roomCode,
      };
    } catch (error) {
      throw new Error(`Error creating room ${error}`);
    }
  }

  async getRooms() {
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

  async getRoomByCode(code: string) {
    try {
      const roomsObject = await this.getRooms();
      if (!roomsObject) {
        throw new Error("No rooms found");
      }

      const activeRooms = Object.entries(roomsObject)
        .map(([_, value]) => ({
          ...(value as Room),
        }))
        .filter((room) => room.isActive === true && room.id === code);

      if (activeRooms.length === 0) {
        throw new Error("Room not found");
      }

      return activeRooms;
    } catch (error) {
      throw new Error(`Error fetching room ${error}`);
    }
  }
}
