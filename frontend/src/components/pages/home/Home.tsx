"use client";
import { CreateRoomModal } from "@/components/shared/CreateRoomModal";
import { QuizBanner } from "@/components/shared/QuizBanner";
import { QuizListCard } from "@/components/shared/QuizListCard";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

  const role = "teacher"; // or "user
  const quizzes = [
    {
      quizId: "1",
      title: "Basic Algebra",
      description: "Learn the fundamentals of algebra, including variables and equations.",
    },
    {
      quizId: "2",
      title: "Geometry Basics",
      description: "Understand shapes, angles, and theorems in geometry.",
    },
    {
      quizId: "3",
      title: "Introduction to Calculus",
      description: "Explore limits, derivatives, and integrals in calculus.",
    },
    {
      quizId: "4",
      title: "Statistics 101",
      description: "Get started with data analysis, probability, and statistics.",
    },
    {
      quizId: "5",
      title: "Physics Fundamentals",
      description: "Dive into the basics of motion, forces, and energy.",
    },
  ];

  const availableQuizzes = [
    { quizId: "1", title: "Basic Algebra" },
    { quizId: "2", title: "Geometry Basics" },
    { quizId: "3", title: "Introduction to Calculus" },
    { quizId: "4", title: "Statistics 101" },
    { quizId: "5", title: "Physics Fundamentals" },
  ];

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
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <QuizListCard
                key={quiz.quizId}
                quizId={quiz.quizId}
                title={quiz.title}
                description={quiz.description}
                setPlayQuizId={handlePlayQuiz}
              />
            ))}
          </div>
        </div>
      )}
      {showCreateRoomModal && role === "teacher" && (
        <CreateRoomModal
          isOpen={showCreateRoomModal}
          onClose={() => setShowCreateRoomModal(false)}
          onCreateRoom={handleCreateRoom}
          selectedQuizId={playQuizId}
          availableQuizzes={availableQuizzes}
        />
      )}
    </div>
  );
}
