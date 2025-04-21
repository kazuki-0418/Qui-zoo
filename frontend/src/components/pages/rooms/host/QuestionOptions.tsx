import type { Question } from "@/types/Question";

type HostQuizPanelQuestionProps = {
  question: Question;
};

export function HostQuizPanelQuestion({ question }: HostQuizPanelQuestionProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 bg-gray-50 rounded-lg p-4">
      <h2 className="text-2xl font-bold">{question.questionText}</h2>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-2">
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
  );
}
