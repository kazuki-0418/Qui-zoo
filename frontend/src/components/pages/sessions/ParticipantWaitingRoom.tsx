"use client";
import { ParticipantList } from "@/components/shared/ParticipantList";
import { WaitingRoomHeader } from "@/components/shared/WaitingRoomHeader";
import { PushButton } from "@/components/ui/PushButton";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { useParticipantStore } from "@/stores/participantStore";
import { useParams } from "next/navigation";
import { useEffect } from "react";

// interface Participant {
//   id: string;
//   name: string;
//   avatar: string;
//   isGuest: boolean;
// }

// TODO : Demo data for participants
// const demoParticipants: Participant[] = [
//   { id: "1", name: "Alice", avatar: "koala", isGuest: false },
//   { id: "2", name: "Bob", avatar: "owl-1", isGuest: true },
// ];

// TODO : Demo data
const participantsLimit = 10;

export function ParticipantWaitingRoom() {
  const params = useParams();
  const { sessionId } = params;
  const { leaveSession } = useWebSocket();
  const { participants, myParticipantId } = useParticipantStore();

  useEffect(() => {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log("Participants in waiting room:", participants);
  }, [participants]);

  // TODO : Demo URL
  const roomCode = params.roomCode;
  const roomUrl = `http://localhost:3000/sessions/${roomCode}`;

  const handleExitRoom = (participantId: string) => {
    // TODO : Exit room
    leaveSession({
      participantId,
      sessionId: sessionId as string,
      isHost: false,
    });
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
        <PushButton
          color="cancel"
          size="md"
          width="full"
          onClick={() => handleExitRoom(myParticipantId as string)}
        >
          Exit Room
        </PushButton>
      </div>
    </div>
  );
}
