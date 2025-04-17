import api from "@/app/api/client";
import axios from "axios";

export const healthCheck = async () => {
  try {
    const data = await api.get("/auth/me");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};
