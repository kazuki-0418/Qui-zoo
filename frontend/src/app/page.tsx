import { Header } from "@/components/shared/Header";
import { QuizListCard } from "@/components/shared/QuizListCard";

export default function Home() {
  return (
    <div>
      <Header username="Jane Smith" avatarImage="koala" />
      <div className="mt-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Continue Learning</h2>
        <div className="space-y-4">
          <QuizListCard
            quizId="1"
            title="Linear Equations"
            description="test"
            // setPlayQuizId={}
          />
          <QuizListCard
            quizId="2"
            title="Rational Numbers"
            description="test"
            // setPlayQuizId={}
          />
        </div>
      </div>
    </div>
  );
}
