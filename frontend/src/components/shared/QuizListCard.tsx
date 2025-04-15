"use client";
import { Button } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";

interface QuizListCardProps {
  quizId: string;
  title: string;
  description: string;
  setPlayQuizId?: (quizId: string) => void;
}

export function QuizListCard({ quizId, title, description, setPlayQuizId }: QuizListCardProps) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      <div className="flex gap-2 mt-4">
        <Link href={`/quiz/${quizId}/details`}>
          <Button color="blue" size="sm">
            <Image src="/assets/icons/bars.svg" alt="details" width={16} height={16} />
          </Button>
        </Link>
        {setPlayQuizId && (
          <Button color="gray" size="sm" onClick={() => setPlayQuizId(quizId)}>
            <Image src="/assets/icons/play.svg" alt="play" width={16} height={16} />
          </Button>
        )}{" "}
      </div>
    </div>
  );
}
