"use client";
import { UserAccessOptions } from "@/components/pages/rooms/UserAccessOptions";
import { FullHeightCardLayout } from "@/components/ui/FullHeightCardLayout";

export default function RoomsUserPage() {
  const allowGuests = true; // TODO: Replace with actual logic to check if the user is a guest
  return (
    <FullHeightCardLayout useWithHeader={false}>
      <UserAccessOptions allowGuests={allowGuests} />
    </FullHeightCardLayout>
  );
}
