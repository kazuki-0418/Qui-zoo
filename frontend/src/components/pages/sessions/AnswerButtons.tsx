import AnswerPushButton from "@/components/pages/sessions/AnswerPushButton";
import type { Question, QuestionStatus } from "@/types/Question";
import type { QuestionResult } from "@/types/Result";
import { useState } from "react";

type AnswerButtonsProps = {
  question: Question;
  onAnswer: (optionId: string) => void;
  isAnswered: boolean;
  questionResult: QuestionResult | null;
  status: QuestionStatus;
};

export function AnswerButtons({
  question,
  onAnswer,
  isAnswered,
  questionResult,
  status,
}: AnswerButtonsProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const showResults = status === "completed";
  const isDisabled = isAnswered || selectedOptionId !== null;

  const handleOptionClick = (text: string) => {
    if (!isDisabled && !showResults) {
      setSelectedOptionId(text);
      onAnswer(text);
    }
  };

  return (
    <div className="w-full grid grid-cols-2 gap-x-2 gap-y-3">
      {question.options.map((text, index) => {
        const isSelected = selectedOptionId === text;
        const isCorrect = question.correctOption === text;
        const count = questionResult?.optionDistribution[text] ?? 0;

        return (
          <AnswerPushButton
            key={text}
            index={index}
            text={text}
            onClick={() => handleOptionClick(text)}
            disabled={isDisabled}
            isSelected={isSelected}
            showResults={showResults}
            isCorrect={isCorrect}
            distributionCount={count}
          />
        );
      })}
    </div>
  );
}

export default AnswerButtons;
