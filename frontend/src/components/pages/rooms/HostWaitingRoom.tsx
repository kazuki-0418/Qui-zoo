import { ParticipantList } from "@/components/shared/ParticipantList";
import { QuestionList } from "@/components/shared/QuestionList";
import { PushButton } from "@/components/ui/PushButton";
import { TabNavigation } from "@/components/ui/Tabs";
import type { Participant } from "@/types/Participant";
import type { Question } from "@/types/Question";
import Image from "next/image";
import { useState } from "react";

// TODO : Demo data for participants
const demoParticipants: Participant[] = [
  { id: "1", name: "Alice", avatar: "koala", isGuest: false },
  { id: "2", name: "Bob", avatar: "owl-1", isGuest: true },
];

// TODO : Demo data for questions
const demoQuestions: Question[] = [
  {
    id: "1",
    text: "What is the capital of Japan?",
    options: ["Tokyo", "Osaka", "Kyoto", "Hiroshima"],
    correctOption: "Tokyo",
    points: 10,
    timeLimit: 30,
    status: "waiting",
  },
  {
    id: "2",
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctOption: "Mars",
    points: 15,
    timeLimit: 45,
    status: "waiting",
  },
  {
    id: "3",
    text: "What is the capital of Japan?",
    options: ["Tokyo", "Osaka", "Kyoto", "Hiroshima"],
    correctOption: "Tokyo",
    points: 10,
    timeLimit: 30,
    status: "waiting",
  },
  {
    id: "4",
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
  const [isCopied, setIsCopied] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>(demoParticipants);
  // const [questions, setQuestions] = useState<Question[]>(demoQuestions);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

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

  const onCopyRoomCode = () => {
    navigator.clipboard.writeText(roomUrl as string);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  return (
    <div className="h-full flex flex-col text-center gap-2">
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-2xl font-bold">Ready to Start the Quiz</h2>
        <div className="flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          <span className="font-medium">{participants.length}</span>
          <span>/</span>
          <span>{participantsLimit}</span>
        </div>
      </div>
      <div className="flex align-center items-center justify-center relative space-x-2">
        <p className="text-gray-600">Room URL: {roomUrl}</p>
        <button
          onClick={onCopyRoomCode}
          className="flex gap-1 align-center text-gray-500 hover:text-gray-700 transition-all duration-300 p-1 rounded-full"
          title="Copy room code"
        >
          <Image
            src={isCopied ? "/assets/icons/check.svg" : "/assets/icons/link.svg"}
            alt={isCopied ? "copied" : "copy"}
            width={20}
            height={20}
            className={`transition-all duration-300 ${isCopied ? "text-green-500" : ""}`}
          />
          <span className="text-sm font-bold">Copy Link</span>
        </button>
      </div>
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
