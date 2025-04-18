export type Question = {
  id: string;
  quizId: string;
  questionText: string;
  options: string[];
  correctOption: string;
  points: number;
  picture?: File;
};

export type CreateQuestion = {
  quizId: string;
  questionText: string;
  options: string[];
  correctOption: string;
  points: number;
  picture?: string;
};

export type UpdateQuestion = {
  questionText?: string;
  options?: string[];
  correctOption?: string;
  points?: number;
  picture?: string;
};
