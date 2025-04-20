"use client";
import { CreateRoomModal } from "@/components/shared/CreateRoomModal";
import { QuizBanner } from "@/components/shared/QuizBanner";
import { QuizCard } from "@/components/shared/QuizCard";
import { skeletonListPlaceholder } from "@/components/ui/SkeltonListPlaceHolder";
import type { Quiz } from "@/types/Quiz";
import { getAllQuizzes } from "@/usecases/question/getAllQuizUsecase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Home() {
  const router = useRouter();
  const [playQuizId, setPlayQuizId] = useState<string | null>(null);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);

  const handlePlayQuiz = (quizId: string) => {
    setPlayQuizId(quizId);
    setShowCreateRoomModal(true);
  };

  const handleCreateRoom = (_rooData: {
    allowGuests: boolean;
    selectedQuizId: string;
    timeLimit: number;
    participantLimit: number;
  }) => {
    // TODO: logic
  };

  // TODO demo

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getQuizzes = async () => {
      setIsLoading(true);
      try {
        const data = await getAllQuizzes();
        setQuizzes(data);
      } catch {
        setError("Failed to fetch quizzes");
      } finally {
        setIsLoading(false);
      }
    };
    getQuizzes();
  }, []);

  const role = "teacher"; // or "user
  // const quizzes = [
  //   {
  //     quizId: "1",
  //     title: "Basic Algebra",
  //     description: "Learn the fundamentals of algebra, including variables and equations.",
  //   },
  //   {
  //     quizId: "2",
  //     title: "Geometry Basics",
  //     description: "Understand shapes, angles, and theorems in geometry.",
  //   },
  //   {
  //     quizId: "3",
  //     title: "Introduction to Calculus",
  //     description: "Explore limits, derivatives, and integrals in calculus.",
  //   },
  //   {
  //     quizId: "4",
  //     title: "Statistics 101",
  //     description: "Get started with data analysis, probability, and statistics.",
  //   },
  //   {
  //     quizId: "5",
  //     title: "Physics Fundamentals",
  //     description: "Dive into the basics of motion, forces, and energy.",
  //   },
  // ]; //useeffect

  // const availableQuizzes = [
  //   { quizId: "1", title: "Basic Algebra" },
  //   { quizId: "2", title: "Geometry Basics" },
  //   { quizId: "3", title: "Introduction to Calculus" },
  //   { quizId: "4", title: "Statistics 101" },
  //   { quizId: "5", title: "Physics Fundamentals" },
  // ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🎉 Hello username!</h1>
      <QuizBanner
        onCreateRoom={() => {
          if (role === "teacher") {
            setPlayQuizId(null);
            setShowCreateRoomModal(true);
          } else {
            router.push("/quiz/");
          }
        }}
        buttonText={role === "teacher" ? "Create Room" : "Join Room"}
      />
      {role === "teacher" && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Popular Quizzes</h2>

          {isLoading && skeletonListPlaceholder({ count: 4 })}

          {error && <p className="text-red-500">{error}</p>}

          {!isLoading && !error && (
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  id={quiz.id}
                  title={quiz.title}
                  category={quiz.category}
                  createdAt={new Date(quiz.createdAt).toLocaleDateString()}
                  setPlayQuizId={handlePlayQuiz}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {showCreateRoomModal && role === "teacher" && (
        <CreateRoomModal
          isOpen={showCreateRoomModal}
          onClose={() => setShowCreateRoomModal(false)}
          createRoom={handleCreateRoom}
          selectedQuizId={playQuizId}
          // availableQuizzes={availableQuizzes}
        />
      )}
    </div>
  );
}
