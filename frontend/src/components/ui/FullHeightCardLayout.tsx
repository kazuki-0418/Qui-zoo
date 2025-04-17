// components/ui/FullHeightCard.tsx
import type { ReactNode } from "react";

interface FullHeightCardProps {
  children: ReactNode;
}

export function FullHeightCardLayout({ children }: FullHeightCardProps) {
  return (
    <div className="container h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] mx-auto md:py-6 flex items-center bg-white md:bg-gray-50">
      <div className="flex flex-col max-w-2xl mx-auto h-full w-full rounded-lg md:border border-gray-200 bg-white md:shadow-md p-5 md:p-6">
        {children}
      </div>
    </div>
  );
}
