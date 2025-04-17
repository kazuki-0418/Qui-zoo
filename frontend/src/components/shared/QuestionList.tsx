interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: string;
  points: number;
  timeLimit: number;
  status: "waiting" | "active" | "timeout" | "completed";
}

interface QuestionListProps {
  questions: Question[];
}

export function QuestionList({ questions }: QuestionListProps) {
  return (
    <div className="space-y-2">
      {questions.map((question) => (
        <div
          key={question.id}
          className="flex flex-col p-3 px-5 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <div className="flex-1 text-start mb-2">
            <p className="font-medium">{question.text}</p>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <span>{question.points} points</span>
              <span>•</span>
              <span>{question.timeLimit} seconds</span>
            </div>
          </div>
          <div className="space-y-1">
            {question.options.map((option) => (
              <div
                key={option}
                className={`flex items-center gap-2 text-sm ${
                  option === question.correctOption
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    option === question.correctOption
                      ? "border-green-600"
                      : "border-gray-400"
                  }`}
                >
                  {option === question.correctOption && (
                    <span className="w-2 h-2 rounded-full bg-green-600" />
                  )}
                </span>
                <span>{option}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 