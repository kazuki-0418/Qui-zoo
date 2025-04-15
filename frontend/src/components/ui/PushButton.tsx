import type React from "react";

type PushButtonProps = {
  color?: "primary" | "secondly" | "warning" | "cancel";
  size?: "sm" | "md" | "lg";
  rounded?: "md" | "lg" | "full";
  width?: string;
  onClick?: (() => void) | ((event: React.MouseEvent<HTMLButtonElement>) => void);
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

const sizeClasses = {
  sm: "text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4",
  md: "text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6",
  lg: "text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8",
};

const bgColorMap: Record<string, string> = {
  primary: "bg-blue-600",
  secondly: "bg-red-600",
  warning: "bg-red-600",
  cancel: "bg-gray-500",
};

const shadowColorMap: Record<string, string> = {
  primary: "#1e40af",
  secondly: "#b91c1c",
  warning: "#b91c1c",
  cancel: "#4b5563",
};

export function PushButton({
  color = "primary",
  size = "md",
  rounded = "full",
  width = "fit",
  onClick,
  disabled = false,
  className = "",
  children,
}: PushButtonProps) {
  const baseClass = [
    "text-white font-semibold transition duration-100 ease-in-out",
    "active:translate-y-[4px]",
    "disabled:cursor-not-allowed disabled:translate-y-[4px]",
    "relative",
  ].join(" ");

  const combinedClass = `${baseClass} ${sizeClasses[size]} w-${width} rounded-${rounded} ${bgColorMap[color]} ${className}`;

  return (
    <div
      className={`relative w-${width} rounded-${rounded} ${disabled ? "opacity-80" : ""}`}
      style={{
        boxShadow: `0 4px 0 0 ${shadowColorMap[color]}`,
      }}
    >
      <button onClick={onClick} className={combinedClass} disabled={disabled}>
        {children}
      </button>
    </div>
  );
}
