import api from "@/app/api/client";
import type { CreateRoom } from "@/types/Room";
import axios from "axios";

export const createRoom = async (roomData: CreateRoom) => {
  try {
    const data = await api.post("/rooms", roomData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};
