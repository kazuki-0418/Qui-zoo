"use client";
import { Button } from "flowbite-react";
import Image from "next/image";

interface DetailsButtonProps {
  onClick?: () => void;
  className?: string;
}

export function DetailsButton({ onClick, className = "" }: DetailsButtonProps) {
  return (
    <Button
      color="gray"
      size="sm"
      onClick={onClick}
      className={`rounded-full w-8 h-8 p-0 flex items-center justify-center transition-transform border-2 border-gray-300 bg-transparent hover:bg-gray-50 ${className}`}
    >
      <Image
        src="/assets/icons/bars.svg"
        alt="details"
        width={14}
        height={14}
        className="opacity-60"
      />
    </Button>
  );
}
