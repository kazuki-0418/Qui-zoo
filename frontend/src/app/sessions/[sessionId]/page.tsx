"use client";
import { ParticipantWaitingRoom } from "@/components/pages/sessions/ParticipantWaitingRoom";
import { FullHeightCardLayout } from "@/components/ui/FullHeightCardLayout";
import type { Participant } from "@/types/Participant";
import type { Question, QuestionStatus } from "@/types/Question";
import type { Result } from "@/types/Result";
import { useEffect, useState } from "react";

// TODO demo
const sampleQuestion: Question = {
  id: "q1",
  text: "What is the capital of France?",
  options: ["London", "Paris", "Berlin", "Madrid"],
  correctOption: "Paris",
  points: 10,
  timeLimit: 30, // seconds
  status: "waiting", // Assuming "unanswered" is a valid QuestionStatus
};

//TODO demo
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

const demoParticipantsLimit = 10; // TODO: Replace with actual limit
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

const sessionId = "12345"; // TODO: Replace with actual session ID from URL or contexts

export default function SessionPage() {
  const [roomState, setRoomState] = useState<QuestionStatus>("waiting");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantsLimit, setParticipantsLimit] = useState<number>(10);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [results, setResults] = useState<Result[] | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    // TODO demo
    setCurrentQuestion(sampleQuestion);
    setParticipants(demoParticipants);
    setParticipantsLimit(demoParticipantsLimit);
  }, [sessionId]);

  const handleAnswer = (optionId: string) => {
    // TODO: Implement answer submission logic
  };

  return (
    <FullHeightCardLayout useWithHeader={false}>
      {roomState === "waiting" && (
        <ParticipantWaitingRoom participants={participants} participantsLimit={participantsLimit} />
        // ) : roomState === "active" ? (
        // <QuestionDisplay
        //   question={currentQuestion?.text}
        //   options={currentQuestion?.options}
        //   timeLimit={currentQuestion?.timeLimit}
        //   onAnswer={handleAnswer}
        //   isAnswered={currentQuestion?.isAnswered}
        //   correctOptionId={currentQuestion?.correctOptionId}
        //   showResults={currentQuestion?.showResults}
        //   answerDistribution={currentQuestion?.answerDistribution}
        // />
        // ) : (
        // <ResultsDisplay
        //   results={results as QuizResult[]}
        //   currentPlayerId="current-user-id" // TODO: Replace with actual user ID
        // />
      )}
    </FullHeightCardLayout>
  );
}
