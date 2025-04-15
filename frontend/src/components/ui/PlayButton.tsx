"use client";
import Image from "next/image";

interface PlayButtonProps {
  onClick: () => void;
}

export function PlayButton({ onClick }: PlayButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-full w-10 h-10 p-0 flex items-center justify-center hover:scale-105 transition-transform bg-blue-600"
    >
      <Image src="/assets/icons/playLineWhite.svg" alt="play" width={20} height={20} />
    </button>
  );
}
