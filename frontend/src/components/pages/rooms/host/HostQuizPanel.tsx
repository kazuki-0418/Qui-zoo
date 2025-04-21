"use client";
import firebaseApp from "@/app/api/firebaseClient";
import { RankingModal } from "@/components/pages/sessions/RankingModal";
import { PushButton } from "@/components/ui/PushButton";
import { QUIZ_STATES } from "@/constants/quizState";
import { useQuiz } from "@/stores/QuizStore";
import type { Question } from "@/types/Question";
import { getDatabase, ref } from "firebase/database";
import { useParams } from "next/navigation";
import { useState } from "react";
import { HostQuizPanelHeader } from "./HostQuizPanelHeader";
import { HostQuizPanelParticipants } from "./HostQuizPanelParticipants";
import { HostQuizPanelQuestion } from "./QuestionOptions";

type Props = {
  question: Question;
  unansweredCount: number;
};

export function HostQuizPanel({ question, unansweredCount }: Props) {
  const { sessionId } = useParams() as { sessionId: string };
  const [isPaused, setIsPaused] = useState(false);
  const { quizState, questionTotal } = useQuiz();
  const [showRankingModal, setShowRankingModal] = useState(false);

  const db = getDatabase(firebaseApp);

  const togglePause = async () => {
    if (!isPaused) {
      const confirmPause = window.confirm("Are you sure you want to pause the quiz?");
      if (!confirmPause) return;
    }
    const newState = !isPaused;
    setIsPaused(newState);
    const quizRef = ref(db, `sessions/${sessionId}/quizState`);
    // await set(quizRef, newState ? "paused" : "active");
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <HostQuizPanelHeader isPaused={isPaused} unansweredCount={unansweredCount} />
      <HostQuizPanelQuestion question={question} />
      <HostQuizPanelParticipants isPaused={isPaused} question={question} />

      <div className="flex gap-2 md:gap-4 mt-2 flex-shrink-0">
        <PushButton
          color="primary"
          size="md"
          width="full"
          onClick={togglePause}
          disabled={!isPaused}
        >
          Resume Quiz
        </PushButton>
        <PushButton color="cancel" size="md" width="full" onClick={togglePause} disabled={isPaused}>
          Pause Quiz
        </PushButton>
      </div>
      {quizState === QUIZ_STATES.RESULTS && showRankingModal && (
        <RankingModal open={showRankingModal} questionTotal={questionTotal} />
      )}
    </div>
  );
}
