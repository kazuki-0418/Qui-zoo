"use client";
import { ParticipantList } from "@/components/shared/ParticipantList";
import { WaitingRoomHeader } from "@/components/shared/WaitingRoomHeader";
import { PushButton } from "@/components/ui/PushButton";
import type { Participant } from "@/types/Participant";
import { useRouter } from "next/navigation";

type ParticipantWaitingRoomProps = {
  participants: Participant[];
  participantsLimit: number;
  isHost?: boolean;
  roomUrl?: string;
};

export function ParticipantWaitingRoom({
  participants,
  participantsLimit,
  isHost = false,
  roomUrl = "",
}: ParticipantWaitingRoomProps) {
  const router = useRouter();

  const handleExitRoom = () => {
    // TODO : Exit room
    router.push("/"); // Redirect to home page
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
        <PushButton color="cancel" size="md" width="full" onClick={handleExitRoom}>
          Exit Room
        </PushButton>
      </div>
    </div>
  );
}
