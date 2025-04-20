"use client";

import { useAuthStore } from "@/app/(no-websocket)/auth/store/useAuthStore";
import AuthButton from "@/app/components/pages/auth/button";
import Input from "@/app/components/pages/auth/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export default function LogInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const [localError, setLocalError] = useState<string | null>(null);

  const { push } = useRouter();

  const { login, isLoading } = useAuthStore();

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data).then(() => {
        alert("Login successful!");
        push("/");
      });
    } catch {
      setLocalError("Login failed. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email">Email</label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            error={errors.email}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            error={errors.password}
          />
        </div>
        {localError && <p className="text-red-500 text-sm">{localError}</p>}

        <AuthButton type="submit" disabled={isSubmitting}>
          {isLoading ? "Loading..." : "Continue"}
        </AuthButton>
      </form>
      <div className="flex mt-4 justify-center text-[.8rem]">
        <p className="text-gray-400 mr-1">Don't have an account?</p>
        <button
          className="text-blue-400"
          onClick={() => {
            push("/auth/signup");
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
