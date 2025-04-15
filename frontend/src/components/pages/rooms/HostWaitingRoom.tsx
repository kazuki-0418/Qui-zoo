import { PushButton } from "@/components/ui/PushButton";
import { Card } from "flowbite-react";
import { ParticipantList } from "./ParticipantList";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isGuest: boolean;
}

interface WaitingRoomProps {
  roomNumber: string;
  participants: Participant[];
  onStartQuiz: () => void;
  onCopyRoomCode: () => void;
}

// TODO username avatar

export function HostWaitingRoom({
  roomNumber,
  participants,
  onStartQuiz,
  onCopyRoomCode,
}: WaitingRoomProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Ready to Start the Quiz</h2>
          <div className="flex items-center justify-center space-x-2">
            <p className="text-gray-600">Room URL: {roomNumber}</p>
            <button
              onClick={onCopyRoomCode}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              title="Copy room code"
            >
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 8v3a1 1 0 0 1-1 1H5m11 4h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v1m4 3v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7.13a1 1 0 0 1 .24-.65L7.7 8.35A1 1 0 0 1 8.46 8H13a1 1 0 0 1 1 1Z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-center">Participants</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <ParticipantList participants={participants} />
          </div>
        </div>
        <div className="flex justify-center">
          <PushButton
            color="primary"
            size="md"
            onClick={onStartQuiz}
            disabled={participants.length < 2}
          >
            Start Quiz
          </PushButton>
        </div>
      </Card>
    </div>
  );
}
