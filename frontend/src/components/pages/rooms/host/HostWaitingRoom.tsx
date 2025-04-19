"use client";
import { ParticipantList } from "@/components/shared/ParticipantList";
import { QuestionList } from "@/components/shared/QuestionList";
import { WaitingRoomHeader } from "@/components/shared/WaitingRoomHeader";
import { PushButton } from "@/components/ui/PushButton";
import { TabNavigation } from "@/components/ui/Tabs";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { useParticipantStore } from "@/stores/participantStore";
import type { Question } from "@/types/Question";
import { useParams } from "next/navigation";
import { useState } from "react";

// TODO : Demo data for participants
// const demoParticipants: Participant[] = [
//   { id: "1", name: "Alice", avatar: "koala", isGuest: false },
//   { id: "2", name: "Bob", avatar: "owl-1", isGuest: true },
// ];

// TODO : Demo data for questions
const demoQuestions: Question[] = [
  {
    id: "1",
    quizId: "1",
    text: "What is the capital of Japan?",
    options: ["Tokyo", "Osaka", "Kyoto", "Hiroshima"],
    correctOption: "Tokyo",
    points: 10,
    timeLimit: 30,
    status: "waiting",
  },
  {
    id: "2",
    quizId: "1",
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctOption: "Mars",
    points: 15,
    timeLimit: 45,
    status: "waiting",
  },
  {
    id: "3",
    quizId: "3",
    text: "What is the capital of Japan?",
    options: ["Tokyo", "Osaka", "Kyoto", "Hiroshima"],
    correctOption: "Tokyo",
    points: 10,
    timeLimit: 30,
    status: "waiting",
  },
  {
    id: "4",
    quizId: "4",
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctOption: "Mars",
    points: 15,
    timeLimit: 45,
    status: "waiting",
  },
];

// TODO : Demo data
const participantsLimit = 10;

const tabs = [
  { id: "participants", label: "Participants" },
  { id: "questions", label: "Questions" },
];

export function HostWaitingRoom() {
  const { participants } = useParticipantStore();
  const { leaveSession } = useWebSocket();
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const params = useParams();
  const { sessionId } = params;

  //TODO demo
  const questions = demoQuestions;
  const roomCode = "123456";
  const roomUrl = `http://localhost:3000/sessions/${roomCode}`;

  const handleStartQuiz = () => {
    if (participants.length < 2) {
      return;
    }
  };

  const handleCancelRoom = () => {
    // TODO : Cancel room
  };

  const handleRemoveParticipant = (id: string) => {
    leaveSession({
      participantId: id,
      sessionId: sessionId as string,
      isHost: true,
    });
  };

  return (
    <div className="h-full flex flex-col text-center gap-2">
      <WaitingRoomHeader
        isHost={true}
        participantsCount={participants.length}
        participantsLimit={participantsLimit}
        roomUrl={roomUrl}
      />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
      <div className="grow bg-gray-50 border border-gray-50 rounded-lg p-4 overflow-y-auto">
        {activeTab === "participants" ? (
          <ParticipantList
            participants={participants}
            onRemoveParticipant={handleRemoveParticipant}
          />
        ) : (
          <QuestionList questions={questions} />
        )}
      </div>
      <div className="flex gap-2 md:gap-4 mt-2">
        <PushButton color="cancel" size="md" width="full" onClick={handleCancelRoom}>
          Close Room
        </PushButton>
        <PushButton
          color="primary"
          size="md"
          width="full"
          onClick={handleStartQuiz}
          disabled={2 < participants.length && participants.length <= participantsLimit}
        >
          Start Quiz
        </PushButton>
      </div>
    </div>
  );
}
