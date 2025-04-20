"use client";
import type { Participant } from "@/types/Participant";
import type { Question } from "@/types/Question";
import type React from "react";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import { QUIZ_STATES, type QuizState } from "../constants/quizState";
import { webSocketAppEvents } from "../constants/websocket-events";
import { useWebSocket } from "./WebSocketContext";
import { useParticipantStore } from "@/stores/participantStore";

type QuizResult = {
  questionId: string;
  correctAnswer: string;
  selectedAnswer: string | null;
  points: number;
};

interface QuizContextValue {
  quizState: QuizState;
  currentQuestion: Question | null;
  timeRemaining: number;
  myParticipantId: string | null;
  hasAnswered: boolean;
  selectedAnswer: string | null;
  questionResults: QuizResult[] | null;
  submitAnswer: (answer: string) => void;
  startQuiz: () => void; // ホストのみ
  nextQuestion: () => void; // ホストのみ
  isHost: boolean;
}

const quizContext = createContext<QuizContextValue>({
  quizState: QUIZ_STATES.WAITING,
  currentQuestion: null,
  timeRemaining: 0,
  myParticipantId: null,
  hasAnswered: false,
  selectedAnswer: null,
  questionResults: null,
  submitAnswer: () => {},
  startQuiz: () => {},
  nextQuestion: () => {},
  isHost: false,
});

// biome-ignore lint/style/useNamingConvention: <explanation>
export const QuizProvider: React.FC<{
  children: ReactNode;
  sessionId: string;
  isHost?: boolean;
}> = ({ children, sessionId, isHost = false }) => {
    // Zustandストアから状態とアクションを取得
    const {  myParticipantId } = useParticipantStore();


  const { socket } = useWebSocket();
  const [quizState, setQuizState] = useState<QuizState>(QUIZ_STATES.WAITING);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [questionResults, setQuestionResults] = useState<QuizResult[] | null>(null);

  useEffect(() => {
    if (!socket) return;

    // クイズ開始ハンドラー
    const handleQuizStart = (sessionId:string) => {
      setQuizState(QUIZ_STATES.READY);
      setHasAnswered(false);
      setSelectedAnswer(null);
    };

    // 質問表示ハンドラー
    const handleQuestionDisplay = (data: {
      question: Question;
      timeLimit: number;
    }) => {
      setCurrentQuestion(data.question);
      setTimeRemaining(data.timeLimit);
      setQuizState(QUIZ_STATES.ACTIVE);
      setHasAnswered(false);
      setSelectedAnswer(null);

      // タイマー開始
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    };

    // 質問結果ハンドラー
    const handleQuestionResults = (data: QuizResult[]) => {
      console.log("Question results received:", data);
      setQuestionResults(data);
      setQuizState(QUIZ_STATES.RESULTS);
    };

    // クイズ終了ハンドラー
    const handleQuizComplete = (_data: unknown) => {
      console.log("Quiz complete event received");
      setQuizState(QUIZ_STATES.COMPLETED);
    };

    // WebSocketイベントリスナーの登録
    socket.on(webSocketAppEvents.QUIZ_START, handleQuizStart);
    socket.on(webSocketAppEvents.QUIZ_NEXT_QUESTION, handleQuestionDisplay);
    socket.on(webSocketAppEvents.QUIZ_QUESTION_RESULT, handleQuestionResults);
    socket.on(webSocketAppEvents.QUIZ_END, handleQuizComplete);

    if (sessionId){
    // セッションの初期データ取得
    socket.emit(webSocketAppEvents.SESSION_DATA, { sessionId });
  }

    // クリーンアップ
    return () => {
      socket.off(webSocketAppEvents.QUIZ_START, handleQuizStart);
      socket.off(webSocketAppEvents.QUIZ_NEXT_QUESTION, handleQuestionDisplay);
      socket.off(webSocketAppEvents.QUIZ_QUESTION_RESULT, handleQuestionResults);
      socket.off(webSocketAppEvents.QUIZ_END, handleQuizComplete);
    };
  }, [socket, sessionId]);

  // 回答提出
  const submitAnswer = (answer: string) => {
    if (!socket || !currentQuestion || hasAnswered || quizState !== QUIZ_STATES.ACTIVE) return;

    socket.emit(webSocketAppEvents.QUIZ_SUBMIT_ANSWER, {
      sessionId,
      questionId: currentQuestion.id,
      answer,
      participantId: myParticipantId,
    });

    setHasAnswered(true);
    setSelectedAnswer(answer);
  };

  // クイズ開始（ホストのみ）
  const startQuiz = () => {
    if (!socket || !isHost) return;
    socket.emit(webSocketAppEvents.QUIZ_START, { sessionId });
  };

  // 次の質問（ホストのみ）
  const nextQuestion = () => {
    if (!socket || !isHost) return;

    socket.emit(webSocketAppEvents.QUIZ_NEXT_QUESTION, { sessionId });
  };

  return (
    <quizContext.Provider
      value={{
        quizState,
        currentQuestion,
        timeRemaining,
        myParticipantId,
        hasAnswered,
        selectedAnswer,
        questionResults,
        submitAnswer,
        startQuiz,
        nextQuestion,
        isHost,
      }}
    >
      {children}
    </quizContext.Provider>
  );
};

// biome-ignore lint/nursery/useComponentExportOnlyModules: <explanation>
export const useQuiz = () => useContext(quizContext);
