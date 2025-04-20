export type CreateRoom = {
  allowGuests: boolean;
  quizId: string;
  hostId: string;
  timeLimit: number;
  participantLimit: number;
};
