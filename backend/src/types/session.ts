export type Session = {
  id: string;
  quizId: string;
  roomId: string;
  currentQuestionIndex: number;
  status: "waiting" | "active" | "ended";
};

export type CreateSession = {
  quizId: string;
  roomId: string;
};
