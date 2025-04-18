import { ParticipantWaitingRoom } from "@/components/pages/sessions/ParticipantWaitingRoom";
import { FullHeightCardLayout } from "@/components/ui/FullHeightCardLayout";

export default function ParticipantWaitingRoomPage() {
  return (
    <FullHeightCardLayout useWithHeader={false}>
      <ParticipantWaitingRoom />
    </FullHeightCardLayout>
  );
}
