export type userActivityLog = {
  id: string;
  user: string;
  userId: string;
  lastActivityDate: string;
  questionsAnswered: number;
  correctAnswers: number;
  sesionsJoined: number;
};

export type createuserActivityLog = {
  // id: string;
  // user: string;
  userId: string;
  lastActivityDate: Date;
  questionsAnswered: number;
  correctAnswers: number;
  sesionsJoined: number;
};

export type updateActivityLog = {
  questionsAnswered?: number;
  correctAnswers?: number;
  sessionsJoined?: number;
};

export type activityLogInfo = {
  id: string;
  email: string;
};
