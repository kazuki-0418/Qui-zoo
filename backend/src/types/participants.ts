export type Participant = {
  id: string;
  quizId: string;
  roomId: string;
  currentQuestionIndex: number;
  status: "waiting" | "active" | "ended";
  socketId: string;
};

export type CreateParticipant = {
  roomCode: string;
  sessionId: string;
  userId: string | null;
  name: string;
  avatar: string;
  isGuest: boolean;
  socketId: string;
};

export type ParticipantOnlineConfig = {
  sessionId: string;
  participantId: string;
  isOnline: boolean;
};
