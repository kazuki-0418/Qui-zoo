import AuthAdapters from "@/adapters/authAdapter";
import { NextResponse } from "next/server";

// biome-ignore lint/style/useNamingConvention: <explanation>
export async function GET(request: Request) {
  if (request.method !== "GET") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  try {
    const response = await AuthAdapters.checkAuthAdapter();

    if (!response) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User found",
      user: response,
    });
  } catch (error) {
    console.error("Error in signup route:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
