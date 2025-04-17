import { healthCheck } from "@/usecases/auth/authMe";
import { signup } from "@/usecases/auth/signupUsecase";
import type { CreateUser, LoginData } from "@/validations/auth/User";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// APIのベースURL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

type User = {
  id: string;
  email: string;
  name?: string;
};

type ErrorResponse = {
  response: {
    data: {
      message: string;
    };
  };
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  signUp: (data: CreateUser) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      signUp: async (createUserData: CreateUser) => {
        try {
          set({ isLoading: true, error: null });

          const response = await signup(createUserData);
          const { user } = response.data;

          set({
            user,
            isLoading: false,
          });
        } catch (error: unknown) {
          const errorResponse = error as ErrorResponse;
          set({
            error: errorResponse.response?.data?.message || "サインアップに失敗しました",
            isLoading: false,
          });
          throw error;
        }
      },

      login: async (loginData) => {
        try {
          set({ isLoading: true, error: null });

          const response = await axios.post(`${API_URL}/auth/login`, {
            ...loginData,
          });

          const { user } = response.data;

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          const errorResponse = error as ErrorResponse;
          set({
            error: errorResponse.response?.data?.message || "ログインに失敗しました",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        const { isAuthenticated } = get();

        if (!isAuthenticated) {
          set({ isAuthenticated: false });
          return false;
        }

        try {
          set({ isLoading: true });

          const response = await healthCheck();

          const { user } = response.data;

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          return true;
        } catch (error) {
          console.error("Error checking auth:", error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });

          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
