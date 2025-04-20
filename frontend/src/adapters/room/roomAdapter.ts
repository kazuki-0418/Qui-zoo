import type { CreateRoom } from "@/types/Room";

class RoomAdapters {
  async createRoomAdapter(data: CreateRoom) {
    const response = await fetch(`${process.env.BACKEND_URL}/rooms`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create room");
    }
    return await response.json();
  }
}

export default new RoomAdapters();
