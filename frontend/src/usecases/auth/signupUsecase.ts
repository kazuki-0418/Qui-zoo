import api from "@/app/api/client";
import type { CreateUser } from "@/validations/auth/User";
import axios from "axios";

export const signup = async (createUserData: CreateUser) => {
  try {
    const data = await api.post("/auth/signup", createUserData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};
