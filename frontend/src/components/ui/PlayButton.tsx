"use client";
import { Button } from "flowbite-react";
import Image from "next/image";

interface PlayButtonProps {
  onClick: () => void;
}

export function PlayButton({ onClick }: PlayButtonProps) {
  return (
    <Button
      color="blue"
      size="sm"
      onClick={onClick}
      className="rounded-full w-10 h-10 p-0 flex items-center justify-center hover:scale-105 transition-transform bg-blue-500"
    >
      <Image src="/assets/icons/playLineWhite.svg" alt="play" width={20} height={20} />
    </Button>
  );
}
