import { AvatarIcon } from "@/components/ui/AvatarIcon";
import { useParticipantStore } from "@/stores/participantStore";
import type { Question } from "@/types/Question";
import { Badge } from "flowbite-react";

type HostQuizPanelParticipantsProps = {
  isPaused: boolean;
  question: Question;
};

export function HostQuizPanelParticipants({ isPaused, question }: HostQuizPanelParticipantsProps) {
  const { participants } = useParticipantStore();

  return (
    <div
      className={`flex-1 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2 ${
        isPaused ? "opacity-50 bg-gray-100" : ""
      }`}
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
  );
}
