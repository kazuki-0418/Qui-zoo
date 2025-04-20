export type Room = {
  id: string;
  code: string;
  quizId: string;
  hostId: string;
  allowGuests: true;
  isActive: boolean;
  createdAt: number;
};

export type CreateRoom = {
  quizId: string;
  hostId: string;
  allowGuests: boolean;
};
