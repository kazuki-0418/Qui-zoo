"use client";
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
    text: "What is the capital of France?",
    options: ["London", "Paris", "Berlin", "Madrid"],
    correctOption: "Paris",
    points: 10,
    timeLimit: 30,
    status: "waiting",
  },
  {
    id: "q2",
    text: "What is the largest planet in our solar system?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctOption: "Jupiter",
    points: 10,
    timeLimit: 30,
    status: "waiting",
  },
];

const demoParticipants: Participant[] = [
  {
    id: "user123",
    name: "Alice Smith",
    avatar: "penguin-1",
  },
  {
    id: "user456",
    name: "Bob Johnson",
    avatar: "penguin-2",
  },
];

const demoParticipantsLimit = 10;

const demoResults: Result = {
  participantRanking: [
    {
      id: "user123",
      name: "Alice Smith",
      score: 30,
      rank: 1,
    },
    {
      id: "user456",
      name: "Bob Johnson",
      score: 20,
      rank: 2,
    },
  ],
  questionResults: {
    q1: {
      correctAnswers: 1,
      wrongAnswers: 1,
      optionDistribution: {
        london: 0,
        paris: 1,
        berlin: 1,
        madrid: 0,
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeExpired, setTimeExpired] = useState(false);
  const currentQuestionId = currentQuestion?.id;

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
  const handleAnswer = (participantId: string, optionId: string) => {
    if (answeredParticipants.includes(participantId)) return;

    const updatedAnswers = [...answeredParticipants, participantId];
    setAnsweredParticipants(updatedAnswers);

    // [API] Send user's answer to the server
    // fetch(`/api/session/${sessionId}/answer`, { method: 'POST', body: JSON.stringify({ participantId, questionId: currentQuestionId, answer: optionId }) })

    // When all participants answered
    if (updatedAnswers.length === participants.length) {
      setShowResults(true);
    }
  };

  // When timer expires
  const handleTimeExpire = useCallback(() => {
    setTimeExpired(true);
    setShowResults(true);
    // API call etc.
  }, []);

  const unansweredCount = participants.length - answeredParticipants.length;

  return (
    <FullHeightCardLayout useWithHeader={false}>
      {roomState === "waiting" && (
        <ParticipantWaitingRoom participants={participants} participantsLimit={participantsLimit} />
      )}

      {roomState === "active" && currentQuestion && (
        <QuestionDisplay
          question={currentQuestion}
          results={results}
          onAnswer={(optionId) => handleAnswer("user123", optionId)} // TODO: Replace with actual participant ID
          isAnswered={answeredParticipants.includes("user123")} // TODO: Replace with actual participant ID
          showResults={showResults}
          answerDistribution={results?.questionResults[currentQuestion.id]?.optionDistribution}
          questionIndex={currentQuestionIndex}
          onTimeExpire={handleTimeExpire}
          unansweredCount={unansweredCount}
        />
      )}
    </FullHeightCardLayout>
  );
}
