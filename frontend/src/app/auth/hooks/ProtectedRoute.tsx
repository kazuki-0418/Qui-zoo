// src/app/auth/hooks/ProtectedRoute.tsx
"use client";

import { useRouter } from "next/navigation"; // next/router ではなく next/navigation を使用
import { type ReactNode, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = "/auth/login" }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();

      if (!isAuth && !isLoading) {
        router.push(redirectTo);
      }
    };

    verifyAuth();
  }, [checkAuth, isAuthenticated, isLoading, redirectTo, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
}
