import AuthAdapters from "@/adapters/authAdapter";
import { NextResponse } from "next/server";

// biome-ignore lint/style/useNamingConvention: <explanation>
export async function POST(request: Request) {
  if (request.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const response = await AuthAdapters.signupAdapter(body);

    return NextResponse.json({
      response,
    });
  } catch (error) {
    console.error("Error in signup route:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
