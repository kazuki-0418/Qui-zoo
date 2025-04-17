import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

interface UseAuthOptions {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

export const useAuth = (options: UseAuthOptions = {}) => {
  const router = useRouter();
  const { redirectTo, redirectIfFound } = options;

  const {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    signUp,
    login,
    logout,
    checkAuth,
    clearError,
  } = useAuthStore();

  useEffect(() => {
    // Authentication check
    const verifyAuth = async () => {
      if (!isLoading) {
        const isAuth = await checkAuth();

        if (redirectTo && !redirectIfFound && !isAuth) {
          // if not authenticated and redirectTo is specified
          // redirect to the specified path
          router.push(redirectTo);
        } else if (redirectIfFound && isAuth && redirectTo) {
          // if authenticated and redirectIfFound is true
          // redirect to the specified path
          router.push(redirectTo);
        }
      }
    };

    verifyAuth();
  }, [checkAuth, isLoading, redirectIfFound, redirectTo, router]);

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    signUp,
    login,
    logout,
    clearError,
  };
};
