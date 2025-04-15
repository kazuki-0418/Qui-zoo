import type React from "react";

type PushButtonProps = {
  color?: "blue" | "lime" | "red" | "green" | "yellow";
  size?: "sm" | "md" | "lg";
  rounded?: "md" | "lg" | "full";
  width?: string;
  onClick?: () => void;
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
  blue: "bg-blue-600",
  red: "bg-red-600",
  gray: "bg-gray-600",
};

const shadowColorMap: Record<string, string> = {
  blue: "#1e40af",
  red: "#b91c1c",
  gray: "#374151",
};

export const pushButton = ({
  color = "blue",
  size = "md",
  rounded = "full",
  onClick,
  disabled = false,
  className = "",
  children,
}: PushButtonProps) => {
  const baseClass = [
    "text-white font-semibold transition duration-100 ease-in-out",
    "active:translate-y-[4px]",
    "disabled:cursor-not-allowed disabled:translate-y-[4px]",
    "relative",
  ].join(" ");

  const combinedClass = `${baseClass} ${sizeClasses[size]} rounded-${rounded} ${bgColorMap[color]} ${className}`;

  return (
    <div
      className={`relative w-fit rounded-${rounded} ${disabled ? "opacity-80" : ""}`}
      style={{
        boxShadow: `0 4px 0 0 ${shadowColorMap[color]}`,
      }}
    >
      <button onClick={onClick} className={combinedClass} disabled={disabled}>
        {children}
      </button>
    </div>
  );
};
