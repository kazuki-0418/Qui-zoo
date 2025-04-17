export type Participant = {
  id: string;
  quizId: string;
  roomId: string;
  currentQuestionIndex: number;
  status: "waiting" | "active" | "ended";
};

export type CreateParticipant = {
  roomCode: string;
  sessionId: string;
  userId: string | null;
  name: string;
  isGuest: boolean;
};

export type ParticipantOnlineConfig = {
  sessionId: string;
  participantId: string;
  isOnline: boolean;
};
