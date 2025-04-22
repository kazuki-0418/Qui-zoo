import AnswerPushButton from "@/components/pages/sessions/AnswerPushButton";
import { QUIZ_STATES } from "@/constants/quizState";
import { useQuiz } from "@/stores/quizStore";
import type { Question } from "@/types/Question";
import type { QuestionResult } from "@/types/Result";

type AnswerButtonsProps = {
  question: Question;
  onAnswer: (optionId: string) => void;
  isAnswered: boolean;
  questionResult: QuestionResult | null;
  // status: QuestionStatus;
};

export function AnswerButtons({ question, onAnswer, questionResult }: AnswerButtonsProps) {
  const { currentQuestion, submitAnswer, hasAnswered, selectedAnswer, quizState } = useQuiz();

  const showResults = quizState === QUIZ_STATES.RESULTS;
  const isDisabled = hasAnswered || selectedAnswer !== null;

  const handleOptionClick = (text: string) => {
    if (!isDisabled && !showResults) {
      submitAnswer(text);
      onAnswer(text);
    }
  };

  return (
    <div className="w-full grid grid-cols-2 gap-x-2 gap-y-3">
      {currentQuestion?.options.map((text, index) => {
        const isSelected = selectedAnswer === text;
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
