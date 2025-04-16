export type UserActivityLog = {
  id: string;
  userId: string;
  lastActivityDate: string;
  questionsAnswered: number;
  correctAnswers: number;
  sessionsJoined: number;
};

export type CreateUserActivityLog = {
  questionsAnswered: number;
  correctAnswers: number;
};

export type UpdateUserActivityLog = {
  questionsAnswered: number;
  correctAnswers: number;
  sessionsJoined: number;
};

export type getUserActivityLogById = {
  lastActivityDate: string;
};
