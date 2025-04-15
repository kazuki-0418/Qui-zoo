import { AvatarIcon } from "@/components/ui/AvatarIcon";
import { Badge } from "flowbite-react";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isGuest?: boolean;
}

interface ParticipantListProps {
  participants: Participant[];
}

export function ParticipantList({ participants }: ParticipantListProps) {
  return (
    <div className="space-y-2">
      {participants.map((participant) => (
        <div
          key={participant.id}
          className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <AvatarIcon avatarImage={participant.avatar} />
            <div className="flex items-center space-x-2">
              <p className="font-medium">{participant.name}</p>
              {participant.isGuest && <Badge color="blue">Guest</Badge>}
            </div>
          </div>
        </div>
      ))}
      {participants.length === 0 && (
        <div className="text-center text-gray-500 py-4">No participants yet</div>
      )}
    </div>
  );
}
