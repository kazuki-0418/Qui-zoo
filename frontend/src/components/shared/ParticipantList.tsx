import { AvatarIcon } from "@/components/ui/AvatarIcon";
import type { Participant } from "@/types/Participant";
import { Badge } from "flowbite-react";
import Image from "next/image";

interface ParticipantListProps {
  participants: Participant[];
  onRemoveParticipant?: (id: string) => void;
}

export function ParticipantList({ participants, onRemoveParticipant }: ParticipantListProps) {
  return (
    <div className="space-y-2">
      {participants.map((participant) => (
        <div
          key={participant.id}
          className="flex items-center justify-between p-2 px-5 bg-white rounded-lg shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <AvatarIcon avatarImage={participant.avatar} avatarSize="sm" />
            <div className="flex items-center space-x-3">
              <p className="font-medium">{participant.name}</p>
              {participant.isGuest && (
                <Badge color="purple" size="sm">
                  Guest
                </Badge>
              )}
            </div>
          </div>
          {onRemoveParticipant && (
            <button
              className="p-1.5 rounded-full hover:bg-gray-50 transition-colors"
              title="Remove participant"
              onClick={() => onRemoveParticipant?.(participant.id)}
            >
              <Image
                src="/assets/icons/close.svg"
                alt="remove"
                width={16}
                height={16}
                className="transition-transform hover:scale-110"
              />
            </button>
          )}
        </div>
      ))}
      {participants.length === 0 && (
        <div className="text-center text-gray-500 py-4">No participants yet</div>
      )}
    </div>
  );
}
