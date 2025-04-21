export type Participant = {
  id: string;
  socketId: string;
  name: string;
  avatar: string;
  score: number;
  userId: string | null;
  isGuest: boolean;
  isOnline: boolean;
  joinedAt: number;
  lastActive: number;
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
