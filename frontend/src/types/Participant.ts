export type Participant = {
  id: string;
  name: string;
  avatar: string;
  isGuest: boolean;
  isOnline: boolean;
  score: number;
  joinedAt: number;
  lastActive: number;
};
