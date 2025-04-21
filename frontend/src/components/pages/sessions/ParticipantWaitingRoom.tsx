"use client";
import { ParticipantList } from "@/components/shared/ParticipantList";
import { WaitingRoomHeader } from "@/components/shared/WaitingRoomHeader";
import { PushButton } from "@/components/ui/PushButton";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { useParticipantStore } from "@/stores/participantStore";

import type { Participant } from "@/types/Participant";
import { useParams } from "next/navigation";

type ParticipantWaitingRoomProps = {
  participants: Participant[];
  participantsLimit: number;
  isHost?: boolean;
  roomUrl?: string;
};

const participantsLimit = 10;

export function ParticipantWaitingRoom({
  participants,
  isHost = false,
}: ParticipantWaitingRoomProps) {
  const params = useParams();
  const { sessionId } = params;
  const { myParticipantId } = useParticipantStore();
  const { leaveSession } = useWebSocket();

  const roomCode = params.roomCode;
  const roomUrl = `http://localhost:3000/sessions/${roomCode}`;

  const handleExitRoom = () => {
    // TODO : Exit room
    leaveSession({
      sessionId: sessionId as string,
      isHost: false,
      participantId: myParticipantId as string,
    });
  };

  return (
    <div className="h-full flex flex-col text-center gap-2">
      <WaitingRoomHeader
        isHost={isHost}
        participantsCount={participants.length}
        participantsLimit={participantsLimit}
        roomUrl={roomUrl}
      />
      <div className="grow bg-gray-50 border border-gray-50 rounded-lg p-4 overflow-y-auto">
        <ParticipantList participants={participants} />
      </div>
      <div className="flex gap-2 md:gap-4 mt-2">
        <PushButton color="cancel" size="md" width="full" onClick={() => handleExitRoom()}>
          Exit Room
        </PushButton>
      </div>
    </div>
  );
}
