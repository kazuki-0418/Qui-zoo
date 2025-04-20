"use client";
import type { Question } from "@/types/Question";
import type React from "react";
import { type ReactNode, useEffect } from "react";
import type { Socket } from "socket.io-client";
import { type StoreApi, create } from "zustand";
import { QUIZ_STATES, type QuizState } from "../constants/quizState";
import { webSocketAppEvents } from "../constants/websocket-events";
import { useWebSocket } from "../contexts/WebSocketContext";
import { useParticipantStore } from "./participantStore";

type QuizResult = {
  questionId: string;
  correctAnswer: string;
  selectedAnswer: string | null;
  points: number;
};

// Zustand store definition
interface QuizStore {
  quizState: QuizState;
  currentQuestion: Question | null;
  timeRemaining: number;
  hasAnswered: boolean;
  selectedAnswer: string | null;
  questionResults: QuizResult[] | null;
  isHost: boolean;
  sessionId: string | null;
  socket: Socket | null;
  myParticipantId: string | null;

  setQuizState: (state: QuizState) => void;
  setCurrentQuestion: (question: Question | null) => void;
  setTimeRemaining: (time: number) => void;
  setHasAnswered: (answered: boolean) => void;
  setSelectedAnswer: (answer: string | null) => void;
  setQuestionResults: (results: QuizResult[] | null) => void;
  setIsHost: (host: boolean) => void;
  setSessionId: (id: string | null) => void;
  setSocket: (socket: Socket | null) => void;
  setMyParticipantId: (id: string | null) => void;

  submitAnswer: (answer: string) => void;
  startQuiz: () => void; // ホストのみ
  nextQuestion: () => void; // ホストのみ
}

const useQuizStore = create<QuizStore>((set, get) => ({
  quizState: QUIZ_STATES.WAITING,
  currentQuestion: null,
  timeRemaining: 0,
  hasAnswered: false,
  selectedAnswer: null,
  questionResults: null,
  isHost: false,
  sessionId: null,
  socket: null,
  myParticipantId: null,

  setQuizState: (state) => set({ quizState: state }),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setHasAnswered: (answered) => set({ hasAnswered: answered }),
  setSelectedAnswer: (answer) => set({ selectedAnswer: answer }),
  setQuestionResults: (results) => set({ questionResults: results }),
  setIsHost: (host) => set({ isHost: host }),
  setSessionId: (id) => set({ sessionId: id }),
  setSocket: (socket) => set({ socket: socket }),
  setMyParticipantId: (id) => set({ myParticipantId: id }),

  submitAnswer: (answer: string) => {
    const { socket, currentQuestion, hasAnswered, quizState, sessionId, myParticipantId } = get();
    if (!socket || !currentQuestion || hasAnswered || quizState !== QUIZ_STATES.ACTIVE) return;

    socket.emit(webSocketAppEvents.QUIZ_SUBMIT_ANSWER, {
      sessionId,
      questionId: currentQuestion.id,
      answer,
      participantId: myParticipantId,
    });

    set({ hasAnswered: true, selectedAnswer: answer });
  },

  startQuiz: () => {
    const { socket, sessionId, isHost } = get();
    if (!socket || !isHost || !sessionId) return;
    socket.emit(webSocketAppEvents.QUIZ_START, { sessionId });
  },

  nextQuestion: () => {
    const { socket, sessionId, isHost } = get();
    if (!socket || !isHost || !sessionId) return;
    socket.emit(webSocketAppEvents.QUIZ_NEXT_QUESTION, { sessionId });
  },
}));

// ドメインロジックを分離するクラス
class QuizDomain {
  private quizStore: StoreApi<QuizStore>;

  constructor(quizStore: StoreApi<QuizStore>) {
    this.quizStore = quizStore;
  }

  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  // biome-ignore lint/correctness/noUnusedFunctionParameters: <explanation>
  handleQuizStart(sessionId: string) {
    this.quizStore.getState().setQuizState(QUIZ_STATES.READY);
    this.quizStore.getState().setHasAnswered(false);
    this.quizStore.getState().setSelectedAnswer(null);
  }

  handleQuestionDisplay(data: { question: Question; timeLimit: number }) {
    const {
      setQuizState,
      setCurrentQuestion,
      setTimeRemaining,
      setHasAnswered,
      setSelectedAnswer,
    } = this.quizStore.getState();

    setCurrentQuestion(data.question);
    setTimeRemaining(data.timeLimit);
    setQuizState(QUIZ_STATES.ACTIVE);
    setHasAnswered(false);
    setSelectedAnswer(null);

    // タイマー開始
    const timer = setInterval(() => {
      const currentTime = this.quizStore.getState().timeRemaining;
      if (currentTime > 0) {
        this.quizStore.getState().setTimeRemaining(currentTime - 1); // Decrement time
      } else {
        clearInterval(timer);
        // Handle timer expiration (e.g., end question)
      }
    }, 1000);

    return () => clearInterval(timer);
  }

  handleQuestionResults(data: QuizResult[]) {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log("Question results received:", data);
    this.quizStore.getState().setQuestionResults(data);
    this.quizStore.getState().setQuizState(QUIZ_STATES.RESULTS);
  }

  handleQuizComplete(_data: unknown) {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log("Quiz complete event received");
    this.quizStore.getState().setQuizState(QUIZ_STATES.COMPLETED);
  }
}

// biome-ignore lint/style/useNamingConvention: <explanation>
export const QuizProvider: React.FC<{
  children: ReactNode;
  sessionId: string;
  isHost?: boolean;
}> = ({ children, sessionId, isHost = false }) => {
  const { socket } = useWebSocket();
  const quizStore = useQuizStore;
  const quizDomain = new QuizDomain(quizStore);
  const { setSocket, setSessionId, setIsHost, setMyParticipantId } = useQuizStore();
  const { myParticipantId } = useParticipantStore();

  useEffect(() => {
    setSocket(socket);
    setSessionId(sessionId);
    setIsHost(isHost);
    setMyParticipantId(myParticipantId);

    if (!socket) return;

    // WebSocketイベントリスナーの登録
    socket.on(webSocketAppEvents.QUIZ_START, (sessionId: string) => {
      quizDomain.handleQuizStart(sessionId);
    });
    socket.on(
      webSocketAppEvents.QUIZ_NEXT_QUESTION,
      (data: { question: Question; timeLimit: number }) => {
        return quizDomain.handleQuestionDisplay(data);
      },
    );
    socket.on(webSocketAppEvents.QUIZ_QUESTION_RESULT, (data: QuizResult[]) => {
      quizDomain.handleQuestionResults(data);
    });
    socket.on(webSocketAppEvents.QUIZ_END, (_data: unknown) => {
      quizDomain.handleQuizComplete(_data);
    });

    if (sessionId) {
      // セッションの初期データ取得
      socket.emit(webSocketAppEvents.SESSION_DATA, { sessionId });
    }

    // クリーンアップ
    return () => {
      if (socket) {
        socket.off(webSocketAppEvents.QUIZ_START, quizDomain.handleQuizStart);
        socket.off(webSocketAppEvents.QUIZ_NEXT_QUESTION, quizDomain.handleQuestionDisplay);
        socket.off(webSocketAppEvents.QUIZ_QUESTION_RESULT, quizDomain.handleQuestionResults);
        socket.off(webSocketAppEvents.QUIZ_END, quizDomain.handleQuizComplete);
      }
    };
  }, [
    socket,
    sessionId,
    isHost,
    quizDomain,
    setSocket,
    setSessionId,
    setIsHost,
    setMyParticipantId,
    myParticipantId,
  ]);

  return <>{children}</>;
};

// biome-ignore lint/nursery/useComponentExportOnlyModules: <explanation>
export const useQuiz = () => {
  const {
    quizState,
    currentQuestion,
    timeRemaining,
    hasAnswered,
    selectedAnswer,
    questionResults,
    submitAnswer,
    startQuiz,
    nextQuestion,
    isHost,
  } = useQuizStore();

  return {
    quizState,
    currentQuestion,
    timeRemaining,
    hasAnswered,
    selectedAnswer,
    questionResults,
    submitAnswer,
    startQuiz,
    nextQuestion,
    isHost,
  };
};
