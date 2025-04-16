"use client";

import { HostWaitingRoom } from "@/components/pages/rooms/HostWaitingRoom";
import { useParams } from "next/navigation";
import { useState } from "react";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isGuest: boolean;
}

export default function HostPage() {
  const { roomCode } = useParams();
  const [participants, setParticipants] = useState<Participant[]>([]);

  const handleStartQuiz = () => {
    // if (participants.length < 2) {
    //   return;
    // }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode as string);
  };

  // Demo data for participants
  const demoParticipants: Participant[] = [
    { id: "1", name: "Alice", avatar: "koala", isGuest: false },
    { id: "2", name: "Bob", avatar: "owl-1", isGuest: true },
  ];

  return (
    <HostWaitingRoom
      roomNumber={roomCode as string}
      participants={demoParticipants}
      onStartQuiz={handleStartQuiz}
      onCopyRoomCode={copyRoomCode}
    />
  );
}
