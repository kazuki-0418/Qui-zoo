import { Question } from "./question";

export type Session = {
  id: string;
  quizId: string;
  roomId: string;
  currentQuestionIndex: number;
  status: SessionStatus;
  joinUrl: string;
  qrCode: string;
  participants: string[] | null;
  startedAt: number | null;
  questions: Question[];
  createdAt: number;
};

export type CreateSession = {
  quizId: string;
  roomId: string;
  questions: Question[];
};

export type SessionStatus = "waiting" | "active" | "timeout";
