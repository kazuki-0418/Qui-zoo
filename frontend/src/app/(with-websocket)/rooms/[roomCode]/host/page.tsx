"use client";
import { HostWaitingRoom } from "@/components/pages/rooms/host/HostWaitingRoom";
import { FullHeightCardLayout } from "@/components/ui/FullHeightCardLayout";

export default function RoomsHostPage() {
  // const {
  //   quizState,
  //   currentQuestion,
  //   timeRemaining,
  //   submitAnswer,
  //   hasAnswered,
  //   selectedAnswer,
  //   questionResults,
  // } = useQuiz();

  return (
    <FullHeightCardLayout>
      <HostWaitingRoom />
    </FullHeightCardLayout>
  );
}
