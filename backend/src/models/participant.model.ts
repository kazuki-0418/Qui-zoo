import * as admin from "firebase-admin";
import { rtdb } from "../infrastructure/firebase_RTDB.config";
import { CreateParticipant, ParticipantOnlineConfig } from "../types/participants";
import { Session } from "../types/session";

export class ParticipantModel {
  async createParticipant(participantConfig: CreateParticipant) {
    try {
      const { sessionId, userId, name, avatar, isGuest } = participantConfig;

      const isDuplicate = await this.checkDuplicateName(sessionId, name);

      if (isDuplicate) {
        throw new Error("Username already exists");
      }
      const participantsRef = rtdb.ref("sessions").child(sessionId).child("participants");
      // Check if the session exists

      const newParticipantRef = participantsRef.push();
      const participantId = newParticipantRef.key;

      const now = admin.database.ServerValue.TIMESTAMP;

      await newParticipantRef.set({
        id: participantId,
        userId: userId,
        name: name,
        avatar: avatar,
        isGuest: isGuest,
        isOnline: true,
        joinedAt: now,
        score: 0,
      });

      await this.incrementSessionParticipantCount(sessionId);

      // update presence status
      await this.updateParticipantOnlineStatus({
        sessionId,
        participantId,
        isOnline: true,
      });

      return participantId;
    } catch (error) {
      throw new Error(`Error creating participant ${error}`);
    }
  }

  async getParticipants(sessionId: string) {
    try {
      const participantsRef = rtdb.ref(`sessions/${sessionId}/participants`);
      const snapshot = await participantsRef.once("value");

      // 修正: snapshot.val() はオブジェクト（反復可能でない）を返す可能性があります
      const participantsData = snapshot.val();

      // null チェックを追加
      if (!participantsData) {
        return [];
      }

      // オブジェクトから配列に変換
      const participants = Object.entries(participantsData).map(([key, value]) => {
        return {
          id: key,
          ...(value as any),
        };
      });

      return participants;
    } catch (error) {
      console.error("Error getting participants:", error);
      throw error;
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

  async checkDuplicateName(sessionId: string, displayName: string): Promise<boolean> {
    try {
      const participantsRef = rtdb.ref("sessions").child(sessionId).child("participants");
      const duplicateNameSnapshot = await participantsRef
        .orderByChild("name")
        .equalTo(displayName)
        .once("value");

      return duplicateNameSnapshot.exists();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Error checking duplicate name: ${errorMessage}`);
    }
  }

  async incrementSessionParticipantCount(sessionId: string): Promise<boolean> {
    try {
      const sessionRef = rtdb.ref(`sessions/${sessionId}`);

      await sessionRef.child("participantCount").transaction((currentCount) => {
        return (currentCount || 0) + 1;
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Error updating participant count: ${errorMessage}`);
    }
  }

  async updateParticipantOnlineStatus(participantConfig: ParticipantOnlineConfig) {
    const { sessionId, participantId, isOnline } = participantConfig;
    try {
      const now = admin.database.ServerValue.TIMESTAMP;

      const participantRef = rtdb.ref(`sessions/${sessionId}/participants/${participantId}`);
      await participantRef.update({
        isOnline: isOnline,
        lastActive: now,
      });

      const presenceRef = rtdb.ref(`presence/${sessionId}/${participantId}`);
      await presenceRef.update({
        online: isOnline,
        lastActive: now,
      });

      return true;
    } catch (error) {
      throw new Error(`Error deleting participant: ${error}`);
    }
  }
}
