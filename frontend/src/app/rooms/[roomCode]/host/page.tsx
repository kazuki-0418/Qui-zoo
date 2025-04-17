"use client";
import { HostWaitingRoom } from "@/components/pages/rooms/HostWaitingRoom";
import { FullHeightCardLayout } from "@/components/ui/FullHeightCardLayout";

export default function RoomsHostPage() {
  return (
    <FullHeightCardLayout>
      <HostWaitingRoom />
    </FullHeightCardLayout>
  );
}
