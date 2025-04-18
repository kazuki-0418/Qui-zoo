// context/QuizContext.tsx
import type React from "react";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import { QUIZ_STATES, type QuizState } from "../constants/quizState";
import { WebSocketEvents } from "../constants/websocket-events";
// import type { Participant, Question, QuizResults } from "../";
import { useWebSocket } from "./WebSocketContext";

type Question = {
  id: string;
  quizId: string;
  questionText: string;
  options: string[];
  correctOption: string;
  points: number;
  picture?: string;
};

type Participant = {
  id: string;
  quizId: string;
  roomId: string;
  currentQuestionIndex: number;
  status: "waiting" | "active" | "timeout" | "ended";
};

type QuizResult = {
  questionId: string;
  correctAnswer: string;
  selectedAnswer: string | null;
  points: number;
};

interface QuizContextValue {
  quizState: QuizState;
  currentQuestion: Question | null;
  participants: Participant[];
  timeRemaining: number;
  myParticipantId: string | null;
  hasAnswered: boolean;
  selectedAnswer: string | null;
  questionResults: QuizResult[] | null;
  submitAnswer: (answer: string) => void;
  startQuiz: () => void; // ホストのみ
  nextQuestion: () => void; // ホストのみ
}

const quizContext = createContext<QuizContextValue>({
  quizState: QUIZ_STATES.WAITING,
  currentQuestion: null,
  participants: [],
  timeRemaining: 0,
  myParticipantId: null,
  hasAnswered: false,
  selectedAnswer: null,
  questionResults: null,
  submitAnswer: () => {},
  startQuiz: () => {},
  nextQuestion: () => {},
});

// biome-ignore lint/style/useNamingConvention: <explanation>
export const QuizProvider: React.FC<{
  children: ReactNode;
  sessionId: string;
  isHost?: boolean;
}> = ({ children, sessionId, isHost = false }) => {
  const { socket } = useWebSocket();
  const [quizState, setQuizState] = useState<QuizState>(QUIZ_STATES.WAITING);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [myParticipantId, setMyParticipantId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [questionResults, setQuestionResults] = useState<QuizResult[] | null>(null);

  useEffect(() => {
    if (!socket) return;

    // 参加成功ハンドラー
    const handleJoinedSession = (data: { participantId: string }) => {
      setMyParticipantId(data.participantId);
    };

    // 新しい参加者ハンドラー
    const handleParticipantJoined = (data: Participant) => {
      setParticipants((prev) => [...prev, data]);
    };

    // 参加者退出ハンドラー
    const handleParticipantLeft = (data: { participantId: string }) => {
      setParticipants((prev) => prev.filter((p) => p.id !== data.participantId));
    };

    // クイズ開始ハンドラー
    const handleQuizStart = () => {
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
      setQuestionResults(data);
      setQuizState(QUIZ_STATES.RESULTS);
    };

    // クイズ終了ハンドラー
    const handleQuizComplete = (_data: unknown) => {
      setQuizState(QUIZ_STATES.COMPLETED);
    };

    // WebSocketイベントリスナーの登録
    socket.on(WebSocketEvents.SESSION_JOIN, handleJoinedSession);
    socket.on(WebSocketEvents.PARTICIPANT_JOINED, handleParticipantJoined);
    socket.on(WebSocketEvents.PARTICIPANT_LEFT, handleParticipantLeft);
    socket.on(WebSocketEvents.QUIZ_START, handleQuizStart);
    socket.on(WebSocketEvents.QUIZ_NEXT_QUESTION, handleQuestionDisplay);
    socket.on(WebSocketEvents.QUIZ_QUESTION_RESULT, handleQuestionResults);
    socket.on(WebSocketEvents.QUIZ_END, handleQuizComplete);

    // セッションの初期データ取得
    socket.emit(WebSocketEvents.SESSION_DATA, { sessionId });

    // クリーンアップ
    return () => {
      socket.off(WebSocketEvents.SESSION_JOIN, handleJoinedSession);
      socket.off(WebSocketEvents.PARTICIPANT_JOINED, handleParticipantJoined);
      socket.off(WebSocketEvents.PARTICIPANT_LEFT, handleParticipantLeft);
      socket.off(WebSocketEvents.QUIZ_START, handleQuizStart);
      socket.off(WebSocketEvents.QUIZ_NEXT_QUESTION, handleQuestionDisplay);
      socket.off(WebSocketEvents.QUIZ_QUESTION_RESULT, handleQuestionResults);
      socket.off(WebSocketEvents.QUIZ_END, handleQuizComplete);
    };
  }, [socket, sessionId]);

  // 回答提出
  const submitAnswer = (answer: string) => {
    if (!socket || !currentQuestion || hasAnswered || quizState !== QUIZ_STATES.ACTIVE) return;

    socket.emit(WebSocketEvents.QUIZ_SUBMIT_ANSWER, {
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

    socket.emit(WebSocketEvents.QUIZ_START, { sessionId });
  };

  // 次の質問（ホストのみ）
  const nextQuestion = () => {
    if (!socket || !isHost) return;

    socket.emit(WebSocketEvents.QUIZ_NEXT_QUESTION, { sessionId });
  };

  return (
    <quizContext.Provider
      value={{
        quizState,
        currentQuestion,
        participants,
        timeRemaining,
        myParticipantId,
        hasAnswered,
        selectedAnswer,
        questionResults,
        submitAnswer,
        startQuiz,
        nextQuestion,
      }}
    >
      {children}
    </quizContext.Provider>
  );
};

// biome-ignore lint/nursery/useComponentExportOnlyModules: <explanation>
export const useQuiz = () => useContext(quizContext);
