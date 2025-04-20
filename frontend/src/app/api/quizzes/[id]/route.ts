// app/api/question/[id]/route.ts
import QuizAdapters from "@/adapters/question/quizAdapter";
import { NextResponse } from "next/server";

// biome-ignore lint/style/useNamingConvention: <explanation>
export async function GET(context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    const response = await QuizAdapters.getQuizByIdAdapter(id);

    if (!response) {
      return NextResponse.json({ message: "Quiz found" }, { status: 404 });
    }

    return NextResponse.json({
      response,
    });
  } catch (error) {
    console.error("Error in get quiz by ID route:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
