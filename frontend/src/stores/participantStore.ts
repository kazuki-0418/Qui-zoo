import type { Participant } from "@/types/Participant";
import { create } from "zustand";

interface ParticipantState {
  participants: Participant[];
  sessionId: string | null;
  myParticipantId: string | null;

  // アクション
  setParticipants: (participants: Participant[]) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (participantId: string) => void;
  setSessionId: (sessionId: string) => void;
  setMyParticipantId: (participantId: string) => void;
  clearAll: () => void;
}

export const useParticipantStore = create<ParticipantState>((set) => ({
  participants: [],
  sessionId: null,
  myParticipantId: null,

  setParticipants: (participants) => set({ participants }),

  addParticipant: (participant) =>
    set((state) => {
      // 重複チェック
      if (state.participants.some((p) => p.id === participant.id)) {
        return state;
      }
      return { participants: [...state.participants, participant] };
    }),

  removeParticipant: (participantId) =>
    set((state) => ({
      participants: state.participants.filter((p) => p.id !== participantId),
    })),

  setSessionId: (sessionId) => set({ sessionId }),

  setMyParticipantId: (participantId) => set({ myParticipantId: participantId }),

  clearAll: () => set({ participants: [], sessionId: null, myParticipantId: null }),
}));
