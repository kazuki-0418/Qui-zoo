"use client";
import firebaseApp from "@/app/api/firebaseClient";
import { AvatarIcon } from "@/components/ui/AvatarIcon";
import { PushButton } from "@/components/ui/PushButton";
import { useQuiz } from "@/stores/QuizStore";
import { useParticipantStore } from "@/stores/participantStore";
import type { Question } from "@/types/Question";
import type { QuestionResult } from "@/types/Result";
import { getDatabase, ref } from "firebase/database";
import { Badge } from "flowbite-react";
import { useParams } from "next/navigation";
import { useState } from "react";

type HostQuizPanelProps = {
  question: Question;
  questionResult: QuestionResult | null;
  unansweredCount: number;
};

export function HostQuizPanel({ question, unansweredCount }: HostQuizPanelProps) {
  const { sessionId } = useParams() as { sessionId: string };
  const { questionIndex } = useQuiz();
  const { participants } = useParticipantStore();
  const [isPaused, setIsPaused] = useState(false);

  const db = getDatabase(firebaseApp);

  //   // 一時停止/再開の切り替え
  const togglePause = async () => {
    if (!isPaused) {
      const confirmPause = window.confirm("Are you sure you want to pause the quiz?");
      if (!confirmPause) {
        return;
      }
    }
    const newState = !isPaused;
    setIsPaused(newState);
    const quizRef = ref(db, `sessions/${sessionId}/quizState`);
    // await set(quizRef, newState ? "paused" : "active");
    // if (newState) {
    //   alert("Quiz paused. Click 'Resume Quiz' to continue.");
    // }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* タイトル */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">Question {questionIndex}</h2>
          {isPaused && <span className="text-red-600 font-semibold ml-3">Paused</span>}
        </div>
        <span className="text-sm text-gray-500">
          {unansweredCount} / {participants.length}
        </span>
      </div>

      {/* 選択肢 */}
      <div className="flex flex-col items-center justify-center gap-2 bg-gray-50 rounded-lg p-4">
        <h2 className="text-2xl font-bold">{question.questionText}</h2>
        <div className="flex mt-2 space-x-4 w-full max-w-md justify-center items-center">
          {question.options.map((option) => {
            const isCorrect = option === question.correctOption;

            return (
              <div key={option} className="flex items-center gap-2 text-sm text-gray-700">
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isCorrect ? "border-green-600" : "border-gray-400"
                  }`}
                >
                  {isCorrect && <span className="w-2 h-2 rounded-full bg-green-600" />}
                </span>
                <span>{option}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 回答状況 */}

      <div
        className={`flex-1 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2 ${isPaused ? "opacity-50 bg-gray-100" : ""}`}
      >
        {[...participants]
          .sort((a, b) => {
            const aAnswered = a.answeredQuestions?.includes(question.id);
            const bAnswered = b.answeredQuestions?.includes(question.id);
            return Number(bAnswered) - Number(aAnswered);
          })
          .map((p) => {
            const answered = p.answeredQuestions?.includes(question.id);
            return (
              <div key={p.id} className="flex items-center justify-between p-2 px-5">
                <div className="flex items-center space-x-2">
                  <AvatarIcon avatarImage={p.avatar} avatarSize="sm" />
                  <div className="flex items-center space-x-3">
                    <p className="font-medium">{p.name}</p>
                    {p.isGuest && (
                      <Badge color="purple" size="sm">
                        Guest
                      </Badge>
                    )}
                  </div>
                </div>
                {answered && (
                  <span className="flex items-center text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <title>Answered</title>
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414L8.414 15 4.293 10.879a1 1 0 111.414-1.414L8.414 12.586l7.879-7.879a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </div>
            );
          })}

        {participants.length === 0 && (
          <div className="text-center text-gray-500 py-4">No participants yet</div>
        )}
      </div>

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
    </div>
  );
}
