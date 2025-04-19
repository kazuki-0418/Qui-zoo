"use client";
import { UserAccessOptions } from "@/components/pages/rooms/UserAccessOptions";
import { FullHeightCardLayout } from "@/components/ui/FullHeightCardLayout";

export default function RoomsUserPage() {
  return (
    <FullHeightCardLayout useWithHeader={false}>
      <UserAccessOptions allowGuests={true} />
    </FullHeightCardLayout>
  );
}
