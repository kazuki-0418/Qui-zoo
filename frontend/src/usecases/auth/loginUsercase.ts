import api from "@/app/api/client";
import type { LoginData } from "@/validations/auth/User";
import axios from "axios";

export const login = async (LoginData: LoginData) => {
  try {
    const data = await api.post("/auth/login", LoginData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};
