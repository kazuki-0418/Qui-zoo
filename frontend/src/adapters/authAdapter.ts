import type { CreateUser, LoginData } from "@/validations/auth/User";

class AuthAdapters {
  async signupAdapter(data: CreateUser) {
    const response = await fetch(`${process.env.BACKEND_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to sign up");
    }

    return await response.json();
  }

  async loginAdapter(data: LoginData) {
    const response = await fetch(`${process.env.BACKEND_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to log in");
    }

    return await response.json();
  }

  async logoutAdapter() {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to log out");
    }

    return await response.json();
  }

  async checkAuthAdapter() {
    const response = await fetch(`${process.env.BACKEND_URL}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to check authentication");
    }

    return await response.json();
  }
}

export default new AuthAdapters();
