"use client";
import { ParticipantList } from "@/components/shared/ParticipantList";
import { WaitingRoomHeader } from "@/components/shared/WaitingRoomHeader";
import { PushButton } from "@/components/ui/PushButton";
import { useRouter } from "next/navigation";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isGuest: boolean;
}

// TODO : Demo data for participants
const demoParticipants: Participant[] = [
  { id: "1", name: "Alice", avatar: "koala", isGuest: false },
  { id: "2", name: "Bob", avatar: "owl-1", isGuest: true },
];

// TODO : Demo data
const participantsLimit = 10;

export function ParticipantWaitingRoom() {
  const router = useRouter();
  //   const [participants, setParticipants] = useState<Participant[]>(demoParticipants);

  const participants = demoParticipants;

  // TODO : Demo URL
  const roomCode = "123456";
  const roomUrl = `http://localhost:3000/sessions/${roomCode}`;

  const handleExitRoom = () => {
    // TODO : Exit room
    router.push("/"); // Redirect to home page
  };

  return (
    <div className="h-full flex flex-col text-center gap-2">
      <WaitingRoomHeader
        isHost={false}
        participantsCount={participants.length}
        participantsLimit={participantsLimit}
        roomUrl={roomUrl}
      />
      <div className="grow bg-gray-50 border border-gray-50 rounded-lg p-4 overflow-y-auto">
        <ParticipantList participants={participants} />
      </div>
      <div className="flex gap-2 md:gap-4 mt-2">
        <PushButton color="cancel" size="md" width="full" onClick={handleExitRoom}>
          Exit Room
        </PushButton>
      </div>
    </div>
  );
}
