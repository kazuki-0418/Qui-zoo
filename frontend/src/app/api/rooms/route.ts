import RoomAdapters from "@/adapters/room/roomAdapter";
import { NextResponse } from "next/server";

// biome-ignore lint/style/useNamingConvention: <explanation>
export async function POST(request: Request) {
  if (request.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();

    const { quizId, hostId, allowGuests } = body;

    if (!quizId || !hostId || allowGuests === undefined) {
      return NextResponse.json(
        { message: "quizId, hostId, and allowGuests are required" },
        { status: 400 },
      );
    }
    const room = await RoomAdapters.createRoomAdapter({
      quizId,
      hostId,
      timeLimit: 30,
      participantLimit: 10,
      allowGuests,
    });
    return NextResponse.json({ message: "Room created", room }, { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
