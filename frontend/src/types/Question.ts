export type Question = {
  id: string;
  quizId: string;
  questionText: string;
  options: string[];
  correctOption: string;
  points: number;
  timeLimit: number;
  status: QuestionStatus;
  picture?: string;
};

export type QuestionStatus = "waiting" | "active" | "timeout" | "completed";
