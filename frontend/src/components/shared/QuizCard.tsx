"use client";
import { DetailsButton } from "@/components/ui/DetailsButton";
import { PlayButton } from "@/components/ui/PlayButton";
import type { Quiz } from "@/types/Quiz";
import { getQuizById } from "@/usecases/question/getQuizByIdUsecase";
// import Link from "next/link";

type QuizCardProps = Pick<Quiz, "id" | "title"> & {
  description: string;
  setPlayQuizId: (quizId: string) => void;
};

// type QuizCardProps = {
//   quizId: string;
//   title: string;
//   description: string;
//   setPlayQuizId: (quizId: string) => void;
// };

export function QuizCard({ id, title, description, setPlayQuizId }: QuizCardProps) {
  const handleDetailsClick = async () => {
    try {
      const quiz = await getQuizById(id);
      return quiz;
    } catch (error) {
      console.error("Faile to fetch quiz:", error);
    }
  };
  return (
    <div className="p-4 md:p-6 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
        <div className="flex gap-2 md:gap-3 ml-4 items-center">
          {/* <Link onClick={handleDetailsClick} href={`/quizzes/${id}`}>
            <DetailsButton />
          </Link> */}
          <DetailsButton onClick={handleDetailsClick} />
          <PlayButton onClick={() => setPlayQuizId(id)} />
        </div>
      </div>
    </div>
  );
}
