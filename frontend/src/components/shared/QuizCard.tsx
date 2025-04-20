"use client";
import { DetailsButton } from "@/components/ui/DetailsButton";
import { PlayButton } from "@/components/ui/PlayButton";
import Link from "next/link";

type QuizCardProps = {
  quizId: string;
  title: string;
  description: string;
  setPlayQuizId: (quizId: string) => void;
};

export function QuizCard({ quizId, title, description, setPlayQuizId }: QuizCardProps) {
  return (
    <div className="p-4 md:p-6 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
        <div className="flex gap-2 md:gap-3 ml-4 items-center">
          <Link href={`/quiz/${quizId}/`}>
            <DetailsButton />
          </Link>
          <PlayButton onClick={() => setPlayQuizId(quizId)} />
        </div>
      </div>
    </div>
  );
}
