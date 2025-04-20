"use client";
import { FinalResultDisplay } from "@/components/pages/sessions/FinalResultDisplay";
import { ParticipantWaitingRoom } from "@/components/pages/sessions/ParticipantWaitingRoom";
import { QuestionDisplay } from "@/components/pages/sessions/QuestionDisplay";
import { FullHeightCardLayout } from "@/components/ui/FullHeightCardLayout";
import type { Participant } from "@/types/Participant";
import type { Question, QuestionStatus } from "@/types/Question";
import type { Result } from "@/types/Result";
import { useCallback, useEffect, useState } from "react";

// TODO demo
const sampleQuestion: Question[] = [
  {
    id: "q1",
    questionText: "What is the capital of France?",
    options: ["London", "Paris", "Berlin", "Madrid"],
    correctOption: "Paris",
    points: 10,
    timeLimit: 30,
    status: "waiting",
    quizId: "quiz1",
  },
  {
    id: "q2",
    questionText: "What is the largest planet in our solar system?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctOption: "Jupiter",
    points: 10,
    timeLimit: 30,
    status: "waiting",
    quizId: "quiz1",
  },
];

const demoParticipants: Participant[] = [
  {
    id: "user123",
    name: "Alice Smith",
    avatar: "penguin-1",
    isGuest: false,
    isOnline: true,
    score: 0,
    joinedAt: Date.now(),
    lastActive: Date.now(),
    answeredQuestions: [],
  },
  {
    id: "user456",
    name: "Bob Johnson",
    avatar: "penguin-2",
    isGuest: false,
    isOnline: true,
    score: 0,
    joinedAt: Date.now(),
    lastActive: Date.now(),
    answeredQuestions: [],
  },
];

const demoParticipantsLimit = 10;

const demoResults: Result = {
  participantRanking: Array.from({ length: 10 }, (_, i) => ({
    id: `user${i + 1}`,
    name: `Participant ${i + 1}`,
    score: Math.floor(Math.random() * 100),
    rank: i + 1,
    avatar: "penguin-1",
  })),
  questionResults: {
    q1: {
      correctAnswers: 5,
      wrongAnswers: 5,
      optionDistribution: {
        london: 2,
        paris: 5,
        berlin: 2,
        madrid: 1,
      },
    },
  },
};

const sessionId = "12345";

export default function SessionPage() {
  const [roomState, setRoomState] = useState<QuestionStatus>("waiting");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantsLimit, setParticipantsLimit] = useState<number>(10);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [results, setResults] = useState<Result | null>(null);
  const [answeredParticipants, setAnsweredParticipants] = useState<string[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showRankingModal, setShowRankingModal] = useState<boolean>(false);
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  const [timeExpired, setTimeExpired] = useState(false);
  const questionTotal = sampleQuestion.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!sessionId) return;

    setCurrentQuestion(sampleQuestion[0]);
    setParticipants(demoParticipants);
    setParticipantsLimit(demoParticipantsLimit);
    setResults(demoResults);
    setRoomState("active");
    // [API] Fetch initial question, participants, and session data here
    // fetch(`/api/session/${sessionId}`)
  }, [sessionId]);

  // Handle user answer
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  // biome-ignore lint/correctness/noUnusedFunctionParameters: <explanation>
  const handleAnswer = (participantId: string, optionId: string) => {
    if (answeredParticipants.includes(participantId)) return;

    const updatedAnswers = [...answeredParticipants, participantId];
    setAnsweredParticipants(updatedAnswers);

    // [API] Send user's answer to the server

    // When all participants answered
    if (updatedAnswers.length === participants.length) {
      setShowResults(true);
    }
  };

  // When timer expires
  const handleTimeExpire = useCallback(() => {
    setTimeExpired(true);
    setShowResults(true);

    setTimeout(() => {
      // get the results
      setShowRankingModal(true);
    }, 3000);
    // [API] Notify server about time expiration
    // fetch(`/api/session/${sessionId}/time-expired`, { method: 'POST' })
  }, []);

  // TODO: Replace with actual participant ID
  const myResult = demoResults.participantRanking.find((p) => p.id === "user1"); // Using demo data for myResult
  const unansweredCount = participants.length - answeredParticipants.length;

  return (
    <FullHeightCardLayout useWithHeader={false}>
      {roomState === "waiting" ? (
        <ParticipantWaitingRoom participants={participants} participantsLimit={participantsLimit} />
      ) : roomState === "active" && currentQuestion ? (
        <QuestionDisplay
          question={currentQuestion}
          results={results}
          questionTotal={questionTotal}
          onAnswer={(optionId) => handleAnswer("user123", optionId)} // TODO: Replace with actual participant ID
          isAnswered={answeredParticipants.includes("user123")} // TODO: Replace with actual participant ID
          showResults={showResults}
          showRankingModal={showRankingModal}
          questionResult={results ? results.questionResults[currentQuestion.id] : null}
          questionIndex={currentQuestionIndex}
          onTimeExpire={handleTimeExpire}
          unansweredCount={unansweredCount}
        />
      ) : roomState === "completed" && results ? (
        <FinalResultDisplay results={results} myResult={myResult ? myResult : null} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      )}
    </FullHeightCardLayout>
  );
}
