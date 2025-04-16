"use client";
import { PushButton } from "@/components/ui/PushButton";
import Image from "next/image";

interface QuizBannerProps {
  buttonText: string;
  onCreateRoom?: () => void;
}

export function QuizBanner({ buttonText, onCreateRoom }: QuizBannerProps) {
  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="relative z-10 p-6 md:p-10 flex flex-row items-center justify-between">
        <div className="mb-2 z-10">
          <span className="text-xs text-gray-300 tracking-widest">GET STARTED</span>
          <h2 className="text-2xl md:text-3xl font-bold my-2">Start Your Learning Journey!</h2>
          <p className="text-white md:text-gray-300 max-w-md">
            Create a room and invite your friends to join. Test your knowledge together!
          </p>
          <div className="mt-6">
            <PushButton color="primary" size="md" onClick={onCreateRoom}>
              {buttonText}
            </PushButton>
          </div>
        </div>
        <div className="absolute -top-3 sm:-top-4 right-0 h-32 sm:h-52 w-32 sm:w-52">
          <Image
            src="/assets/images/rocket.png"
            alt="Rocket"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
