import { PushButton } from "@/components/ui/PushButton";
import { Card } from "flowbite-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ParticipantList } from "../../shared/ParticipantList";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isGuest: boolean;
}

export function HostWaitingRoom() {
  const { roomCode } = useParams();
  // const [participants, setParticipants] = useState<Participant[]>([]);

  // TODO : Demo URL
  const roomUrl = "/test";

  // TODO : Demo data for participants
  const demoParticipants: Participant[] = [
    { id: "1", name: "Alice", avatar: "koala", isGuest: false },
    { id: "2", name: "Bob", avatar: "owl-1", isGuest: true },
  ];

  const handleStartQuiz = () => {
    // if (participants.length < 2) {
    //   return;
    // }
  };

  const onCopyRoomCode = () => {
    navigator.clipboard.writeText(roomCode as string);
  };

  return (
    <div className="container h-full mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Ready to Start the Quiz</h2>
          <div className="flex items-center justify-center space-x-2">
            <p className="text-gray-600">Room URL: {roomUrl}</p>
            <button
              onClick={onCopyRoomCode}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full active:bg-gray-100"
              title="Copy room code"
            >
              <Image src="/assets/icons/fileLine.svg" alt="copy" width={22} height={22} />
            </button>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-center">Participants</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <ParticipantList participants={demoParticipants} />
          </div>
        </div>
        <div className="flex justify-center">
          <PushButton
            color="primary"
            size="md"
            onClick={handleStartQuiz}
            // disabled={participants.length < 2}
          >
            Start Quiz
          </PushButton>
        </div>
      </Card>
    </div>
  );
}
