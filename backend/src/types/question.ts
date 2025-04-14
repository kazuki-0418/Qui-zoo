export type Question = {
  id: string;
  quizId: string;
  questionText: string;
  options: string[];
  correctOption: string;
  points: number;
};

export type CreateQuestion = {
  quizId: string;
  questionText: string;
  options: string[];
  correctOption: string;
  points: number;
};

export type UpdateQuestion = {
  questionText?: string;
  options?: string[];
  correctOption?: string;
  points?: number;
};
