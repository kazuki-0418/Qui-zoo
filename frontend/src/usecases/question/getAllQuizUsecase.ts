import api from "@/app/api/client";
import type { Quiz } from "@/types/Quiz";
import axios from "axios";

export const getAllQuizzes = async (): Promise<Quiz[]> => {
  try {
    const response = await api.get("/auth/quizzes");
    return response.data as Quiz[];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};
