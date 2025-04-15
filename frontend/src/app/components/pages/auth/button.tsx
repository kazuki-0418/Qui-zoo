"use client";

import { cn } from "@/app/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type AuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
};

export default function AuthButton({
  variant = "primary",
  children,
  className,
  ...props
}: AuthButtonProps) {
  const baseStyle = "px-6 py-2 rounded font-medium transition-colors duration-200";

  const variants = {
    primary: "bg-green-500 text-white hover:bg-blue-300 shadow-md/20",
    secondary: "bg-gray-300 text-black hover:bg-gray-400",
  };

  return (
    <button className={cn(baseStyle, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
