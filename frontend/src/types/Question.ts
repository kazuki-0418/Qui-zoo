export type Question = {
  id: string;
  text: string;
  options: string[];
  correctOption: string;
  points: number;
  timeLimit: number;
  status: QuestionStatus;
};

export type QuestionStatus = "waiting" | "active" | "timeout" | "completed";
