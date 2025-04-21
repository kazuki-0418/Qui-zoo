"use client";
import { HostQuizPanel } from "@/components/pages/rooms/host/HostQuizPanel";
import { HostWaitingRoom } from "@/components/pages/rooms/host/HostWaitingRoom";
import { FinalResultDisplay } from "@/components/pages/sessions/FinalResultDisplay";
import { FullHeightCardLayout } from "@/components/ui/FullHeightCardLayout";
import { QUIZ_STATES } from "@/constants/quizState";
import { useQuiz } from "@/stores/QuizStore";
import { useParticipantStore } from "@/stores/participantStore";
// TODO demo

export default function RoomsHostPage() {
  const { quizState, currentQuestion, questionResult } = useQuiz();
  const { participants, answeredParticipantsCount } = useParticipantStore();
  const unansweredCount = participants.length - answeredParticipantsCount;

  return (
    <FullHeightCardLayout useWithHeader={false}>
      {quizState === QUIZ_STATES.WAITING && <HostWaitingRoom />}
      {/* 完了状態と進行中状態を別々に条件判定 */}
      {(quizState === QUIZ_STATES.RESULTS || quizState === QUIZ_STATES.ACTIVE) &&
        currentQuestion && (
          <HostQuizPanel
            question={currentQuestion}
            questionResult={questionResult}
            unansweredCount={unansweredCount}
          />
        )}
      {quizState === QUIZ_STATES.COMPLETED && <FinalResultDisplay myResult={null} />}
    </FullHeightCardLayout>
  );
}
