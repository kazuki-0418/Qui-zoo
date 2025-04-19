import { AnswerButtons } from "@/components/pages/sessions/AnswerButtons";
import type { Question, QuestionStatus } from "@/types/Question";
import { useEffect, useState } from "react";
import { Timer } from "./Timer";

type QuestionDisplayProps = {
  question: Question;
  onAnswer: (optionId: string) => void;
  isAnswered: boolean;
  showResults: boolean;
  answerDistribution?: Record<string, number>;
  questionIndex: number;
  onTimeExpire: () => void;
  unansweredCount: number;
};

export function QuestionDisplay({
  question,
  onAnswer,
  isAnswered,
  showResults,
  answerDistribution = {},
  questionIndex,
  onTimeExpire,
  unansweredCount,
}: QuestionDisplayProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const handleOptionClick = (optionId: string) => {
    if (!isAnswered && !showResults) {
      setSelectedOptionId(optionId);
      onAnswer(optionId);

      // await submitAnswer({ questionId: question.id, selectedOption: optionId });
    }
  };

  useEffect(() => {
    setSelectedOptionId(null);
  }, [question]);

  const status: QuestionStatus = showResults ? "completed" : "active";

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-full mt-2 mb-6">
        <Timer
          isResult={showResults}
          duration={question.timeLimit}
          onExpire={onTimeExpire}
          questionIndex={questionIndex}
        />
      </div>
      <h2 className="grow text-xl font-bold mt-2 mb-6 text-center">{question.text}</h2>
      <AnswerButtons
        question={question}
        onAnswer={(optionId) => {
          handleOptionClick(optionId);
        }}
        isAnswered={isAnswered}
        questionResult={{
          correctAnswers: 0,
          wrongAnswers: 0,
          optionDistribution: answerDistribution,
        }}
        status={status}
      />
      <div className="mt-6 text-sm text-gray-500 h-[1rem] flex items-center justify-center">
        {!showResults && (
          <>
            Waiting for {unansweredCount} more participant{unansweredCount !== 1 ? "s" : ""}
          </>
        )}
      </div>
    </div>
  );
}
