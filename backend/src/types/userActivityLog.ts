export type userActivityLog = {
  id: string;
  user: string;
  userId: string;
  date: Date;
  questionsAnswered: number;
  correctAnswers: number;
  sesionsJoined: number;
};

export type updateActivityLog = {
  questionsAnswered?: number;
  correctAnswers?: number;
  sessionsJoined?: number;
};
